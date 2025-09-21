import type React from "react";
import { useState } from "react";
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

// Placeholder hooks
const useAuth = () => ({
  requestSellerAccess: async (formData: any) => {
    console.log("Submitting seller request:", formData);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Math.random() > 0.3; // 70% success rate
  },
});

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
  },
});

export default function SellerRequestForm() {
  const { requestSellerAccess } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    businessName: "",
    businessType: "",
    description: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await requestSellerAccess(formData);
      if (success) {
        toast({
          title: "Request Submitted",
          description:
            "Your seller request has been submitted for admin approval.",
        });
        setFormData({
          email: "",
          name: "",
          businessName: "",
          businessType: "",
          description: "",
          phone: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Become a Seller
          </CardTitle>
          <CardDescription className="text-slate-600">
            Submit your application to start selling on our platform
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  handleInputChange("businessType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="books">Books & Media</SelectItem>
                  <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
