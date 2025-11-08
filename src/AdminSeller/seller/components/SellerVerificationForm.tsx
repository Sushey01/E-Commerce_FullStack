import React, {
  useState,
  FormEvent,
  ChangeEvent,
  CSSProperties,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabase";

// 1. Define the TypeScript interface for the form data
interface SellerVerificationData {
  // Static data (pre-filled from initial application/database)
  fullName: string;
  email: string;
  businessName: string;
  phone: string;

  // Dynamic data (updated documentation fields)
  licenseNo: string; // Business License No / PAN ID
  fullAddress: string;
  governmentIDUrl: string; // government_id_url in DB
  note?: string; // optional note from seller; stored in `notes`
}

// Helper toast
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string;
    description?: string;
    variant?: string;
  }) => {
    console.log(`Toast [${variant || "default"}]: ${title} - ${description}`);
  },
});

// 2. Define style objects using CSSProperties type
const styles = {
  container: {
    maxWidth: "650px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)",
  } as CSSProperties,
  header: {
    marginBottom: "30px",
    paddingBottom: "15px",
    borderBottom: "2px solid #3b82f6",
  } as CSSProperties,
  h1: {
    fontSize: "1.8rem",
    color: "#1f2937",
    marginBottom: "5px",
  } as CSSProperties,
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#3b82f6",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "5px",
    marginBottom: "20px",
    marginTop: "30px",
  } as CSSProperties,
  paragraph: {
    color: "#6b7280",
    fontSize: "0.95rem",
  } as CSSProperties,
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  } as CSSProperties,
  fullWidth: {
    gridColumn: "1 / -1",
  } as CSSProperties,
  formGroup: {
    marginBottom: "0px",
  } as CSSProperties,
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#374151",
  } as CSSProperties,
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  } as CSSProperties,
  inputStatic: {
    backgroundColor: "#f3f4f6",
    cursor: "default",
    color: "#4b5563",
  } as CSSProperties,
  submitButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "30px",
  } as CSSProperties,
  submitButtonDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
  } as CSSProperties,
  statusMessage: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "6px",
    fontWeight: 600,
    textAlign: "center",
  } as CSSProperties,
  statusSuccess: {
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #10b981",
  } as CSSProperties,
  statusError: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #ef4444",
  } as CSSProperties,
};

const SellerVerificationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SellerVerificationData>({
    fullName: "",
    email: "",
    businessName: "",
    phone: "",
    licenseNo: "",
    fullAddress: "",
    governmentIDUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [loading, setLoading] = useState(true);
  // Signed preview URL for the just-uploaded file (not stored in DB)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  // store sellerId as number to match DB type
  const [sellerIdNum, setSellerIdNum] = useState<number | null>(null);
  const [sellerStatus, setSellerStatus] = useState<string | null>(null);
  const [hasDocs, setHasDocs] = useState<boolean>(false);
  const [latestRequestStatus, setLatestRequestStatus] = useState<string | null>(
    null
  );

  // Load current user profile and seller row
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const authUser = auth.user;
        if (!authUser) {
          toast({
            title: "Not logged in",
            description: "Please login first",
            variant: "destructive",
          });
          navigate("/loginPage");
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("id, full_name, email, phone")
          .eq("id", authUser.id)
          .single();

        const { data: sellerRow } = await supabase
          .from("sellers")
          .select("seller_id, company_name, status, address")
          .eq("user_id", authUser.id)
          .single();

        setSellerId(sellerRow?.seller_id ? String(sellerRow.seller_id) : null);
        setSellerIdNum(sellerRow?.seller_id ?? null);
        setSellerStatus(sellerRow?.status ?? null);

        // Check latest verification request status and presence of docs
        if (sellerRow?.seller_id) {
          try {
            const { data: req } = await supabase
              .from("seller_verification_request")
              .select(
                "status, government_id_url, business_license_no, business_full_address, submitted_at"
              )
              .eq("seller_id", sellerRow.seller_id)
              .order("submitted_at", { ascending: false })
              .limit(1);
            const latest = req && req[0];
            setLatestRequestStatus(latest?.status || null);
            // consider docs present if required fields exist
            const have = !!(
              latest &&
              (latest.business_license_no || "").trim() &&
              (latest.government_id_url || "").trim() &&
              (latest.business_full_address || "").trim()
            );
            setHasDocs(have);
          } catch {
            setHasDocs(false);
            setLatestRequestStatus(null);
          }
        } else {
          setHasDocs(false);
          setLatestRequestStatus(null);
        }

        setFormData((prev) => ({
          ...prev,
          fullName: profile?.full_name || "",
          email: profile?.email || authUser.email || "",
          phone: profile?.phone || "",
          businessName: sellerRow?.company_name || "",
          fullAddress: sellerRow?.address || "",
        }));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, toast]);

  // Attempt to persist verification details (optional table), then mark active
  const onSubmitVerification = async (data: SellerVerificationData) => {
    if (!sellerIdNum) throw new Error("Seller account not found");

    // Fetch current auth user for debug context
    const { data: authCtx } = await supabase.auth.getUser();
    const currentUserId = authCtx?.user?.id;

    // Insert a verification request (pending review) per current schema
    const { error: reqErr } = await supabase
      .from("seller_verification_request")
      .insert({
        seller_id: sellerIdNum,
        government_id_url: data.governmentIDUrl || null,
        business_license_no: data.licenseNo || null,
        business_full_address: data.fullAddress || null,
        notes: data.note || null,
        status: "pending",
      });
    if (reqErr) {
      // Enhanced diagnostic logging for Row-Level Security failures
      console.error("Verification request insert failed (likely RLS).", {
        errorMessage: reqErr.message,
        errorDetails: (reqErr as any).details,
        errorHint: (reqErr as any).hint,
        currentUserId,
        sellerIdNum,
        payload: {
          seller_id: sellerIdNum,
          government_id_url: data.governmentIDUrl || null,
          business_license_no: data.licenseNo || null,
          business_full_address: data.fullAddress || null,
          notes: data.note || null,
          status: "pending",
        },
      });
      throw reqErr;
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!sellerId) {
      alert("Seller account not found. Please reload and try again.");
      return;
    }

    // Basic validations
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file.");
      return;
    }
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`File must be <= ${MAX_MB}MB.`);
      return;
    }

    try {
      setIsUploading(true);
      // Unique path per seller
      const ext = file.name.split(".").pop() || "bin";
      const path = `${sellerId}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("sellers_documents")
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
        });
      if (upErr) {
        console.error("Storage upload failed", {
          message: upErr.message,
          name: upErr.name,
          status: (upErr as any).status,
        });
        throw upErr;
      }

      // Store only the storage path; generate signed URL for preview.
      setFormData((prev) => ({ ...prev, governmentIDUrl: path }));
      // Generate a signed preview URL (not stored in DB) for immediate feedback
      try {
        const { data: signed } = await supabase.storage
          .from("sellers_documents")
          .createSignedUrl(path, 60 * 30); // 30 minutes preview
        if (signed?.signedUrl) {
          setPreviewUrl(signed.signedUrl);
        }
      } catch (e) {
        console.warn("Signed preview URL failed", e);
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(err?.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("idle");

    // Validation checks updated to new field names
    if (
      !formData.licenseNo ||
      !formData.fullAddress ||
      !formData.governmentIDUrl
    ) {
      alert(
        "Please complete all required fields (Business License/PAN, Address) and upload the Government ID document."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmitVerification(formData);
      setSubmissionStatus("success");
      setHasDocs(true);
      setLatestRequestStatus("pending");
      // Redirect to dashboard so Products tab shows the pending state
      setTimeout(() => navigate("/seller/dashboard"), 800);
    } catch (error) {
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonStyles: CSSProperties = {
    ...styles.submitButton,
    ...(isSubmitting ? styles.submitButtonDisabled : {}),
  };

  const finalSuccessStyle = {
    ...styles.statusMessage,
    ...styles.statusSuccess,
  };
  const finalErrorStyle = { ...styles.statusMessage, ...styles.statusError };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>✅ Final Seller Verification</h1>
        <p style={styles.paragraph}>
          Your initial application has been **Approved**. Please complete the
          following steps to finalize your account and begin selling.
        </p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : latestRequestStatus === "approved" ? (
        <div style={{ ...styles.statusMessage, ...styles.statusSuccess }}>
          Your seller account is already verified and active.
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => navigate("/seller/dashboard")}
              style={{ ...styles.submitButton }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : latestRequestStatus === "pending" ? (
        <div
          style={{
            ...styles.statusMessage,
            ...styles.statusError,
            backgroundColor: "#fff7ed",
            color: "#9a3412",
            border: "1px solid #fbbf24",
          }}
        >
          Your verification request has been submitted and is pending admin
          review.
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        {/* --- Section 1: Static Profile Data (Read-Only) --- */}
        <h3 style={styles.sectionTitle}>Profile Information (Static)</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              style={{ ...styles.input, ...styles.inputStatic }}
              readOnly
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              style={{ ...styles.input, ...styles.inputStatic }}
              readOnly
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              style={{ ...styles.input, ...styles.inputStatic }}
              readOnly
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              style={{ ...styles.input, ...styles.inputStatic }}
              readOnly
            />
          </div>
        </div>

        {/* --- Section 2: Dynamic Legal/Operational Data --- */}
        <h3 style={styles.sectionTitle}>Required Legal Documentation</h3>
        <div style={styles.formGrid}>
          {/* Business License No / PAN ID */}
          <div style={styles.formGroup}>
            <label htmlFor="licenseNo" style={styles.label}>
              Business/Trade License No. or PAN/Citizenship No. *
            </label>
            <input
              id="licenseNo"
              name="licenseNo"
              type="text"
              value={formData.licenseNo}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter registration or ID number"
            />
          </div>

          {/* Government ID Upload (The file upload field) */}
          <div style={styles.formGroup}>
            <label htmlFor="governmentIDUrl" style={styles.label}>
              Upload Government ID / License Document *
            </label>
            <input
              id="governmentIDUrl"
              name="governmentIDUrl"
              type="file"
              accept=".pdf, .png, .jpg"
              onChange={handleFileUpload}
              required={!formData.governmentIDUrl}
              style={{ ...styles.input, padding: "10px" }}
              disabled={isSubmitting || isUploading}
            />
            {isUploading && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                Uploading...
              </p>
            )}
            {previewUrl && !isUploading && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  color: "#10b981",
                }}
              >
                Document uploaded successfully!
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  View file
                </a>
              </p>
            )}
          </div>

          {/* Removed separate PAN field – combined with License No per schema */}

          {/* Full Address (Full Width) */}
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="fullAddress" style={styles.label}>
              Full Registered Business Address *
            </label>
            <input
              id="fullAddress"
              name="fullAddress"
              type="text"
              value={formData.fullAddress}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Street, City, Zip/Postal Code, Country"
            />
          </div>

          {/* Optional Note to Admin */}
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="note" style={styles.label}>
              Additional Notes (optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: 90 }}
              placeholder="Share any context for the reviewer (optional)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={submitButtonStyles}
        >
          {isSubmitting
            ? "Verifying and Saving..."
            : latestRequestStatus === "rejected"
            ? "Resubmit Verification"
            : "Submit Verification for Review"}
        </button>
      </form>

      {/* Submission Status Messages */}
      {submissionStatus === "success" && (
        <div style={finalSuccessStyle}>
          ✅ Your verification request has been submitted. We'll notify you
          after review.
        </div>
      )}
      {submissionStatus === "error" && (
        <div style={finalErrorStyle}>
          ❌ Submission failed. Please check your inputs or contact support.
        </div>
      )}
    </div>
  );
};

export default SellerVerificationForm;
