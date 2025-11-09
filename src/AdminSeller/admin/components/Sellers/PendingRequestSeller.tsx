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

// Helper component: generate a signed URL if value is a storage path, with public fallback
const DynamicSignedLink: React.FC<{ pathOrUrl?: string | null }> = ({
  pathOrUrl,
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      if (!pathOrUrl) return;
      // Legacy full URL
      if (/^https?:\/\//i.test(pathOrUrl)) {
        setUrl(pathOrUrl);
        return;
      }
      try {
        // Prefer signed URL (private bucket)
        const { data, error } = await supabase.storage
          .from("sellers_documents")
          .createSignedUrl(pathOrUrl, 60 * 30);
        if (error || !data?.signedUrl) {
          // Fallback to public URL (if object/bucket is public)
          const { data: pub } = supabase.storage
            .from("sellers_documents")
            .getPublicUrl(pathOrUrl) as any;
          if (pub?.publicUrl) {
            setUrl(pub.publicUrl);
          } else {
            setFailed(true);
            setUrl(null);
          }
        } else {
          setUrl(data.signedUrl);
        }
      } catch (e) {
        // Unexpected error: try public URL as last resort
        try {
          const { data: pub } = supabase.storage
            .from("sellers_documents")
            .getPublicUrl(pathOrUrl) as any;
          if (pub?.publicUrl) {
            setUrl(pub.publicUrl);
          } else {
            setFailed(true);
            setUrl(null);
          }
        } catch {
          setFailed(true);
          setUrl(null);
        }
      }
    };
    run();
  }, [pathOrUrl]);

  if (!pathOrUrl) return <span className="text-sm">—</span>;
  if (!url && !failed)
    return (
      <span className="text-xs text-muted-foreground">Generating link…</span>
    );
  if (failed && !url)
    return (
      <span className="text-xs text-muted-foreground">Link unavailable</span>
    );
  return (
    <a
      href={url!}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 text-sm hover:underline"
    >
      View Document
    </a>
  );
};

// Types for request rows
interface VerificationRequest {
  id: string;
  seller_id: number;
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  reviewer_id: string | null;
  notes: string | null;
  government_id_url: string | null;
  business_license_no: string | null;
  business_full_address: string | null;
  // Joined fields
  company_name?: string;
  user_email?: string;
  user_full_name?: string;
}

const STATUS_VARIANT_MAP: Record<string, "pending" | "default" | "inactive"> = {
  pending: "pending",
  approved: "default",
  rejected: "inactive",
};

const PendingRequestSeller: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("seller_verification_request")
        .select(
          "id, seller_id, submitted_at, status, reviewed_at, reviewer_id, notes, government_id_url, business_license_no, business_full_address"
        )
        .order("submitted_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error: reqErr } = await query;
      if (reqErr) throw reqErr;

      const rowsRaw = (data || []) as any[];
      const sellerIds = Array.from(
        new Set(rowsRaw.map((r) => r.seller_id).filter(Boolean))
      );

      let sellersMap: Record<
        number,
        { company_name?: string; user_id?: string }
      > = {};
      if (sellerIds.length) {
        const { data: sellersData } = await supabase
          .from("sellers")
          .select("seller_id, company_name, user_id")
          .in("seller_id", sellerIds as any);
        sellersMap = (sellersData || []).reduce((acc: any, s: any) => {
          acc[s.seller_id] = {
            company_name: s.company_name,
            user_id: s.user_id,
          };
          return acc;
        }, {});
      }

      const userIds = Object.values(sellersMap)
        .map((v) => v.user_id)
        .filter(Boolean) as string[];
      let usersMap: Record<string, { full_name?: string; email?: string }> = {};
      if (userIds.length) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds as any);
        usersMap = (usersData || []).reduce((acc: any, u: any) => {
          acc[u.id] = { full_name: u.full_name, email: u.email };
          return acc;
        }, {});
      }

      const rows: VerificationRequest[] = rowsRaw.map((r: any) => {
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
    } catch (e: any) {
      setError(e.message || "Failed to load verification requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (
    id: string,
    sellerId: number,
    newStatus: "approved" | "rejected"
  ) => {
    setProcessingId(id);
    try {
      const {
        data: { user: adminUser },
      } = await supabase.auth.getUser();
      const reviewerId = adminUser?.id || null;

      const { error: updErr } = await supabase
        .from("seller_verification_request")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_id: reviewerId,
        })
        .eq("id", id);
      if (updErr) throw updErr;

      if (newStatus === "approved") {
        await supabase
          .from("sellers")
          .update({ status: "active" })
          .eq("seller_id", sellerId);
      }

      await fetchRequests();
    } catch (e) {
      console.error("Status update failed", e);
    } finally {
      setProcessingId(null);
    }
  };

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
            onChange={(e) => setStatusFilter(e.target.value as any)}
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
      {!loading && !error && requests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No verification requests</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
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
                    {new Date(req.submitted_at).toLocaleString()}
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
                  <span className="font-medium">Admin Notes:</span> {req.notes}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      disabled={processingId === req.id}
                      onClick={() =>
                        updateStatus(req.id, req.seller_id, "approved")
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
                        updateStatus(req.id, req.seller_id, "rejected")
                      }
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
                {req.status !== "pending" && (
                  <Badge variant="default" className="text-xs">
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
