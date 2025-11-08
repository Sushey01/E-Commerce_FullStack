import React, { useEffect, useState, useCallback } from "react";
import supabase from "../../../../supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";

// Status -> badge variant mapping
const STATUS_VARIANT_MAP = {
  pending: "pending",
  approved: "default",
  rejected: "inactive",
};

// Helper component: generates a signed URL if value is a storage path (non-http)
const DynamicSignedLink = ({ pathOrUrl }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const run = async () => {
      if (!pathOrUrl) return;
      // If already a full URL (legacy rows) just use it
      if (/^https?:\/\//i.test(pathOrUrl)) {
        setUrl(pathOrUrl);
        return;
      }
      try {
        const { data, error } = await supabase.storage
          .from("sellers_documents")
          .createSignedUrl(pathOrUrl, 60 * 30); // 30 min
        if (error) {
          console.error("Signed URL generation failed", {
            message: error.message,
            pathOrUrl,
          });
          setUrl(null);
        } else {
          setUrl(data?.signedUrl || null);
        }
      } catch (e) {
        console.error("Signed URL unexpected error", e);
        setUrl(null);
      }
    };
    run();
  }, [pathOrUrl]);
  if (!pathOrUrl) return <span className="text-sm">—</span>;
  if (!url)
    return (
      <span className="text-xs text-muted-foreground">Generating link…</span>
    );
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-blue-600 underline"
    >
      View Document
    </a>
  );
};

const PendingRequestSeller = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [processingId, setProcessingId] = useState(null);
  // Optional admin notes per request (used mainly when rejecting)
  const [notesMap, setNotesMap] = useState({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("seller_verification_request")
        .select(
          `id, seller_id, submitted_at, status, reviewed_at, reviewer_id, notes, government_id_url, business_license_no, business_full_address, sellers: seller_id ( company_name ), users: seller_id ( user_id )`
        )
        .order("submitted_at", { ascending: false });

      // Filter by status if not 'all'
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error: reqErr } = await query;
      if (reqErr) throw reqErr;

      // Need seller company and user email/full_name via additional joins
      const sellerIds = (data || []).map((r) => r.seller_id).filter(Boolean);
      let sellersMap = {};
      if (sellerIds.length) {
        const { data: sellersData } = await supabase
          .from("sellers")
          .select("seller_id, company_name, user_id")
          .in("seller_id", sellerIds);
        sellersMap = (sellersData || []).reduce((acc, s) => {
          acc[s.seller_id] = {
            company_name: s.company_name,
            user_id: s.user_id,
          };
          return acc;
        }, {});
      }
      const userIds = Object.values(sellersMap)
        .map((v) => v.user_id)
        .filter(Boolean);
      let usersMap = {};
      if (userIds.length) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);
        usersMap = (usersData || []).reduce((acc, u) => {
          acc[u.id] = { full_name: u.full_name, email: u.email };
          return acc;
        }, {});
      }

      const rows = (data || []).map((r) => {
        const sellerMeta = sellersMap[r.seller_id] || {};
        const userMeta = sellerMeta.user_id
          ? usersMap[sellerMeta.user_id] || {}
          : {};
        return {
          id: r.id,
          seller_id: r.seller_id,
          submitted_at: r.submitted_at,
          status: r.status,
          reviewed_at: r.reviewed_at,
          reviewer_id: r.reviewer_id,
          notes: r.notes,
          government_id_url: r.government_id_url,
          business_license_no: r.business_license_no,
          business_full_address: r.business_full_address,
          company_name: sellerMeta.company_name,
          user_email: userMeta.email,
          user_full_name: userMeta.full_name,
        };
      });

      setRequests(rows);
    } catch (e) {
      setError((e && e.message) || "Failed to load verification requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id, newStatus, sellerId) => {
    setProcessingId(id);
    try {
      // determine reviewer (current admin)
      const { data: userData } = await supabase.auth.getUser();
      const reviewerId = userData?.user?.id || null;

      // Validate notes when rejecting
      const note = notesMap[id] || "";
      if (newStatus === "rejected" && (!note || !note.trim())) {
        setError("Please provide a note when rejecting a request.");
        return;
      }

      const { error: updErr } = await supabase
        .from("seller_verification_request")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_id: reviewerId,
          notes: note || null,
        })
        .eq("id", id);
      if (updErr) throw updErr;

      // If approved, activate seller profile
      if (newStatus === "approved" && sellerId) {
        const { error: sellerErr } = await supabase
          .from("sellers")
          .update({ status: "active" })
          .eq("seller_id", sellerId);
        if (sellerErr) throw sellerErr;
      }

      await fetchRequests();
    } catch (e) {
      console.error("Status update failed", e);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests;
  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Seller Verification Requests
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Pending: {counts.pending}</span>
            <span>Approved: {counts.approved}</span>
            <span>Rejected: {counts.rejected}</span>
            <span>Total: {counts.total}</span>
          </div>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6 text-center">Loading...</CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      )}
      {!loading && !error && filtered.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No verification requests</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((req) => (
          <Card key={req.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {req.user_full_name || req.user_email || "Unknown seller"}
                  </CardTitle>
                  <CardDescription>{req.user_email}</CardDescription>
                  <div className="text-xs mt-1 text-muted-foreground">
                    Company: {req.company_name || "—"}
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT_MAP[req.status] || "inactive"}>
                  {req.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Submitted
                  </p>
                  <p className="text-sm">
                    {req.submitted_at
                      ? new Date(req.submitted_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Business License / PAN
                  </p>
                  <p className="text-sm">{req.business_license_no || "—"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Business Address
                  </p>
                  <p className="text-sm break-words">
                    {req.business_full_address || "—"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Government ID Document
                  </p>
                  {req.government_id_url ? (
                    <DynamicSignedLink pathOrUrl={req.government_id_url} />
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              </div>

              {req.notes && (
                <div className="text-sm bg-muted p-3 rounded">
                  <span className="font-medium">Notes:</span> {req.notes}
                </div>
              )}

              {/* Admin note (optional for approve, required for reject) */}
              {req.status === "pending" && (
                <div className="w-full">
                  <label className="text-xs font-medium text-muted-foreground">
                    Admin Note
                  </label>
                  <textarea
                    className="mt-1 w-full border rounded p-2 text-sm min-h-[60px]"
                    placeholder="Optional note for approval; required when rejecting"
                    value={notesMap[req.id] || ""}
                    onChange={(e) =>
                      setNotesMap((prev) => ({
                        ...prev,
                        [req.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      disabled={processingId === req.id}
                      onClick={() =>
                        updateStatus(req.id, "approved", req.seller_id)
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingId === req.id}
                      onClick={() =>
                        updateStatus(req.id, "rejected", req.seller_id)
                      }
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
                {req.status !== "pending" && (
                  <Badge variant="outline" className="text-xs">
                    Reviewed{" "}
                    {req.reviewed_at
                      ? new Date(req.reviewed_at).toLocaleDateString()
                      : ""}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestSeller;
