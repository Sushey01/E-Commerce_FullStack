import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { Button } from "../admin/ui/button";
import { Input } from "../admin/ui/input";
import { Label } from "../admin/ui/label";
import { Textarea } from "../admin/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../admin/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../admin/ui/select";

// Auth hook
const useAuth = () => ({
  requestSellerAccess: async (formData: any) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user)
        throw new Error("Please login first to submit a seller request");

      // Step 1: Insert seller request with auto-approved status
      const { error: requestError } = await supabase.from("seller_requests").insert({
        user_id: user.id,
        email: formData.email,
        name: formData.name,
        business_name: formData.businessName,
        business_type: formData.businessType,
        description: formData.description,
        phone: formData.phone,
        status: "approved", // Auto-approve for testing
        request_date: new Date().toISOString(),
        approved_date: new Date().toISOString(), // Set approval date
      });

      if (requestError) throw requestError;

      // Step 2: Update user role to "seller" in users table
      const { error: roleError } = await supabase
        .from("users")
        .update({ 
          role: "seller",
          business_name: formData.businessName,
          business_type: formData.businessType,
          phone: formData.phone
        })
        .eq("id", user.id);

      if (roleError) {
        console.error("Error updating user role:", roleError);
        // Don't throw error here, just log it
      }

      return true;
    } catch (error) {
      console.error("Request submission error:", error);
      throw error;
    }
  },
});

// Simple toast notification system
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    // Console log for debugging
    console.log(`Toast [${variant || "default"}]: ${title} - ${description}`);

    // Create visual notification
    const isError = variant === "destructive";
    const bgColor = isError ? "bg-red-500" : "bg-green-500";

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md`;
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm mt-1">${description}</div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      toast.style.transition = "all 0.3s ease";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 10);

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 5000);
  },
});

export default function SellerRequestForm() {
  const navigate = useNavigate();
  const { requestSellerAccess } = useAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false); // Only prefill once
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    businessName: "",
    businessType: "",
    description: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load user data only once
  useEffect(() => {
    if (loaded) return;

    const loadUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          toast({
            title: "Authentication Required",
            description: "Please login first to submit a seller request.",
            variant: "destructive",
          });
          navigate("/loginPage");
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("email, full_name, phone")
          .eq("id", user.id)
          .single();

        setFormData({
          email: profile?.email || user.email || "",
          name: profile?.full_name || user.user_metadata?.full_name || "",
          phone: profile?.phone ? String(profile.phone) : "",
          businessName: "",
          businessType: "",
          description: "",
        });

        setLoaded(true); // mark as loaded
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [loaded, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.businessName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your business name.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.businessType) {
      toast({
        title: "Validation Error",
        description: "Please select your business type.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a business description.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting seller request with data:", formData);
      await requestSellerAccess(formData);

      toast({
        title: "Seller Account Approved!",
        description:
          "Congratulations! Your seller account has been automatically approved. You can now access the seller dashboard to manage your products.",
      });

      // Reset only non-prefilled fields after successful submission
      setFormData((prev) => ({
        ...prev,
        businessName: "",
        businessType: "",
        description: "",
        // Keep phone as it might be needed for future requests
      }));

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      console.error("Seller request submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          error.message ||
          "Failed to submit request. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Become a Seller
          </CardTitle>
          <CardDescription className="text-slate-600">
            Submit your application to start selling on our platform. Your
            account information has been pre-filled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-slate-50 text-slate-600 cursor-not-allowed"
                  title="This is your registered email address and cannot be changed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Enter your business name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  handleInputChange("businessType", value)
                }
              >
                <SelectTrigger className="bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto z-50">
                  <SelectItem
                    value="electronics"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Electronics
                  </SelectItem>
                  <SelectItem
                    value="clothing"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Clothing & Fashion
                  </SelectItem>
                  <SelectItem
                    value="home"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Home & Garden
                  </SelectItem>
                  <SelectItem
                    value="books"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Books & Media
                  </SelectItem>
                  <SelectItem
                    value="sports"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Sports & Outdoors
                  </SelectItem>
                  <SelectItem
                    value="beauty"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Beauty & Personal Care
                  </SelectItem>
                  <SelectItem
                    value="automotive"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Automotive
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Tell us about your business and what you plan to sell..."
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Seller Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
