import type React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// Auth hook for seller registration
const useSellerAuth = () => ({
  registerSeller: async (formData: any) => {
    try {
      console.log("Starting seller registration with data:", formData);

      // Check if user already exists in auth but not in users table
      let userId = null;
      let isExistingAuth = false;

      // First try to sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "seller",
          },
        },
      });

      console.log("Auth signup result:", { authData, authError });

      if (authError) {
        // If user already registered in auth, handle differently
        if (authError.message.includes("User already registered")) {
          throw new Error(
            "Email already exists. If this is your email, please login instead of registering again."
          );
        } else {
          console.error("Auth error:", authError);
          throw new Error(authError.message);
        }
      } else {
        if (!authData.user) {
          throw new Error("Failed to create account - no user returned");
        }
        userId = authData.user.id;
        console.log("Auth account created successfully, user ID:", userId);

        // Sign out immediately to avoid interfering with existing sessions
        await supabase.auth.signOut();
        console.log(
          "Signed out after account creation to preserve existing sessions"
        );
      }

      // Wait a moment for auth to complete
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // This is a new seller registration - don't allow existing users to convert

      // Create new seller profile in users table
      const userProfileData = {
        id: userId,
        email: formData.email,
        full_name: formData.fullName,
        role: "seller",
        phone: formData.phone,
        created_at: new Date().toISOString(),
      };

      // Try to add business fields if they exist in the table
      const businessFields = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        business_description: formData.businessDescription,
        business_address: formData.businessAddress,
        tax_id: formData.taxId,
        bank_account: formData.bankAccount,
      };

      console.log("Attempting to insert user profile:", {
        ...userProfileData,
        ...businessFields,
      });

      const { data: insertData, error: profileError } = await supabase
        .from("users")
        .insert({ ...userProfileData, ...businessFields })
        .select();

      console.log("Profile insert result:", { insertData, profileError });

      if (profileError) {
        console.error("Profile creation error:", profileError);

        // Try inserting with just basic fields if business fields don't exist
        console.log("Trying with basic fields only...");
        const { data: basicInsertData, error: basicInsertError } =
          await supabase.from("users").insert(userProfileData).select();

        console.log("Basic profile insert result:", {
          basicInsertData,
          basicInsertError,
        });

        if (basicInsertError) {
          console.error(
            "Basic profile creation also failed:",
            basicInsertError
          );
          throw new Error(
            `Failed to create user profile: ${basicInsertError.message}`
          );
        } else {
          console.log("Basic profile created successfully");
        }
      } else {
        console.log("Full profile created successfully");
      }

      return {
        success: true,
        message: "Seller registration completed successfully",
      };
    } catch (error) {
      console.error("Seller registration error:", error);
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
    console.log(`Toast [${variant || "default"}]: ${title} - ${description}`);
    const isError = variant === "destructive";
    const bgColor = isError ? "bg-red-500" : "bg-green-500";
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md`;
    toast.innerHTML = `<div class="font-semibold">${title}</div><div class="text-sm mt-1">${description}</div>`;
    document.body.appendChild(toast);
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      toast.style.transition = "all 0.3s ease";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.parentNode?.removeChild(toast), 300);
    }, 5000);
  },
});

export default function SellerForm() {
  const navigate = useNavigate();
  const { registerSeller } = useSellerAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessAddress: "",
    taxId: "",
    bankAccount: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.businessName.trim() ||
      !formData.businessType ||
      !formData.businessDescription.trim() ||
      !formData.phone.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting form with data:", formData);
      const result = await registerSeller(formData);
      console.log("Registration result:", result);

      if (result.success) {
        toast({
          title: "Seller Registration Successful!",
          description: result.message + " Redirecting to seller dashboard...",
        });

        // Clear form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          businessName: "",
          businessType: "",
          businessDescription: "",
          businessAddress: "",
          taxId: "",
          bankAccount: "",
        });

        // Always redirect to login page after successful registration
        setTimeout(() => {
          navigate("/loginPage");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Registration Failed",
        description:
          error.message ||
          "Failed to register. Please try again. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-900">
            Become a Seller
          </CardTitle>
          <CardDescription className="text-slate-600">
            Create your seller account and start selling on our platform
          </CardDescription>
          <div className="text-sm text-slate-500 mt-2">
            Already have a customer account?{" "}
            <Link to="/loginPage" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Create a password (min 6 characters)"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
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

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
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
                  <Label htmlFor="businessType">Business Category *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleInputChange("businessType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      <SelectItem value="electronics">
                        Electronics & Technology
                      </SelectItem>
                      <SelectItem value="clothing">
                        Clothing & Fashion
                      </SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="books">Books & Media</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="beauty">
                        Beauty & Personal Care
                      </SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">
                  Business Description *
                </Label>
                <Textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={(e) =>
                    handleInputChange("businessDescription", e.target.value)
                  }
                  placeholder="Describe your business, products, and services..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  placeholder="Enter your complete business address"
                  rows={3}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Additional Information (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    Tax ID / Business Registration Number
                  </Label>
                  <Input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="Enter your tax ID or registration number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account Details</Label>
                  <Input
                    id="bankAccount"
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) =>
                      handleInputChange("bankAccount", e.target.value)
                    }
                    placeholder="Bank account for payments"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Seller Account"}
              </Button>

              <div className="text-center text-sm text-slate-500">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
