import React, { useState, useRef } from "react";
import { Button } from "../../admin/ui/button";
import { Input } from "../../admin/ui/input";
import { Label } from "../../admin/ui/label";
import { Textarea } from "../../admin/ui/textarea";
import { Badge } from "../../admin/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../admin/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../admin/ui/card";
import {
  Upload,
  X,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  Tag,
  FileText,
  ImageIcon,
  Star,
  Boxes,
  TrendingUp,
  Plus,
  Minus,
} from "lucide-react";
import supabase from "../../../supabase";
import ImageUpload, { ImageUploadRef } from "./ImageUpload";

type Product = {
  id?: string;
  category_id: string;
  subcategory_id: string;
  subsubcategory_id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  old_price?: string;
  rating: string;
  reviews: number;
  images: string;
  variant: string;
  outofstock: boolean;
  brand_id: number;
  created_at?: string;
  updated_at?: string;
};

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

export default function ProductForm({
  product,
  onClose,
  onSuccess,
  user,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stockQuantity, setStockQuantity] = useState(100);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageUploadRef = useRef<ImageUploadRef>(null);

  // Initialize categories in database
  const initializeCategories = async () => {
    const categories = [
      { id: "00000000-0000-0000-0000-000000000001", name: "Electronics" },
      { id: "00000000-0000-0000-0000-000000000002", name: "Clothing" },
      { id: "00000000-0000-0000-0000-000000000003", name: "Home & Garden" },
      { id: "00000000-0000-0000-0000-000000000004", name: "Sports" },
      { id: "00000000-0000-0000-0000-000000000005", name: "Books" },
      {
        id: "00000000-0000-0000-0000-000000000006",
        name: "Beauty & Personal Care",
      },
      { id: "00000000-0000-0000-0000-000000000007", name: "Automotive" },
      { id: "00000000-0000-0000-0000-000000000008", name: "Toys & Games" },
    ];

    try {
      for (const category of categories) {
        const { error } = await supabase
          .from("categories")
          .upsert(category, { onConflict: "id" });

        if (error) {
          console.error(`Error creating category ${category.name}:`, error);
        }
      }
      console.log("Categories initialized successfully");
    } catch (error) {
      console.error("Failed to initialize categories:", error);
    }
  };

  // Initialize categories when component mounts
  React.useEffect(() => {
    initializeCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("productTitle") as string;
    const description = formData.get("productDescription") as string;
    const price = formData.get("productPrice") as string;
    const category = formData.get("productCategory") as string;

    if (!title?.trim()) {
      alert("Product title is required");
      return;
    }
    if (!description?.trim()) {
      alert("Product description is required");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    const productData = {
      title: title.trim(),
      subtitle: (formData.get("productSubtitle") as string)?.trim() || null,
      description: description.trim(),
      price: parseFloat(price).toFixed(2),
      old_price: (formData.get("productOldPrice") as string) || "0.00",
      rating: "0.00",
      reviews: parseInt((formData.get("productReviews") as string) || "0"),
      images: JSON.stringify(imageUrls),
      variant: JSON.stringify({
        sizes:
          (formData.get("productSizes") as string)
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [],
        colors:
          (formData.get("productColors") as string)
            ?.split(",")
            .map((c) => c.trim())
            .filter(Boolean) || [],
        materials:
          (formData.get("productMaterials") as string)
            ?.split(",")
            .map((m) => m.trim())
            .filter(Boolean) || [],
      }),
      outofstock: stockQuantity === 0,
      category_id: category || "00000000-0000-0000-0000-000000000001",
      subcategory_id: null,
      subsubcategory_id: null,
      brand_id: parseInt((formData.get("productBrand") as string) || "1"),
    };

    setIsLoading(true);
    try {
      if (product?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        alert("Product updated successfully!");
      } else {
        // Upload images first
        let finalImageUrls = imageUrls;
        if (imageUploadRef.current) {
          finalImageUrls = await imageUploadRef.current.uploadAllImages();
        }
        productData.images = JSON.stringify(finalImageUrls);

        const { error } = await supabase.from("products").insert([productData]);

        if (error) {
          // If foreign key constraint fails, try with minimal data
          if (
            error.message.includes("foreign key constraint") ||
            error.message.includes("violates")
          ) {
            console.warn(
              "Foreign key constraint failed, trying with minimal data:",
              error.message
            );

            const minimalProductData = {
              title: productData.title,
              description: productData.description,
              price: productData.price,
              images: productData.images,
              variant: productData.variant,
              outofstock: productData.outofstock,
              old_price: productData.old_price,
              rating: productData.rating,
              reviews: productData.reviews,
            };

            const { error: retryError } = await supabase
              .from("products")
              .insert([minimalProductData]);
            if (retryError) throw retryError;

            alert(
              "Product added successfully! (Note: Category information was not saved due to database constraints)"
            );
          } else {
            throw error;
          }
        } else {
          alert("Product added successfully!");
        }
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: "00000000-0000-0000-0000-000000000001", name: "Electronics" },
    { id: "00000000-0000-0000-0000-000000000002", name: "Clothing" },
    { id: "00000000-0000-0000-0000-000000000003", name: "Home & Garden" },
    { id: "00000000-0000-0000-0000-000000000004", name: "Sports" },
    { id: "00000000-0000-0000-0000-000000000005", name: "Books" },
    {
      id: "00000000-0000-0000-0000-000000000006",
      name: "Beauty & Personal Care",
    },
    { id: "00000000-0000-0000-0000-000000000007", name: "Automotive" },
    { id: "00000000-0000-0000-0000-000000000008", name: "Toys & Games" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {product ? "Edit Product" : "Add New Product"}
              </CardTitle>
              <CardDescription>
                {product
                  ? "Update product information"
                  : "Complete seller product form with all details"}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productTitle">Product Title *</Label>
                  <Input
                    id="productTitle"
                    name="productTitle"
                    defaultValue={product?.title || ""}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productSubtitle">Product Subtitle</Label>
                  <Input
                    id="productSubtitle"
                    name="productSubtitle"
                    defaultValue={product?.subtitle || ""}
                    placeholder="Enter product subtitle (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCategory">Category *</Label>
                  <Select
                    name="productCategory"
                    defaultValue={product?.category_id || ""}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productBrand">Brand ID</Label>
                  <Input
                    id="productBrand"
                    name="productBrand"
                    type="number"
                    defaultValue={product?.brand_id || 1}
                    placeholder="Enter brand ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Description *</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  defaultValue={product?.description || ""}
                  placeholder="Enter detailed product description"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Reviews
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Current Price *</Label>
                  <Input
                    id="productPrice"
                    name="productPrice"
                    type="number"
                    step="0.01"
                    defaultValue={product?.price || ""}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productOldPrice">Original Price</Label>
                  <Input
                    id="productOldPrice"
                    name="productOldPrice"
                    type="number"
                    step="0.01"
                    defaultValue={product?.old_price || ""}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productReviews">Number of Reviews</Label>
                  <Input
                    id="productReviews"
                    name="productReviews"
                    type="number"
                    defaultValue={product?.reviews || 0}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Stock Management
              </h3>
              <div className="flex items-center gap-4">
                <Label>Stock Quantity:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setStockQuantity(Math.max(0, stockQuantity - 1))
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-medium">
                    {stockQuantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setStockQuantity(stockQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Badge
                  variant={stockQuantity === 0 ? "outOfStock" : "completed"}
                >
                  {stockQuantity === 0 ? "Out of Stock" : "In Stock"}
                </Badge>
              </div>
            </div>

            {/* Product Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Product Variants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productSizes">Available Sizes</Label>
                  <Input
                    id="productSizes"
                    name="productSizes"
                    placeholder="S, M, L, XL"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate sizes with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productColors">Available Colors</Label>
                  <Input
                    id="productColors"
                    name="productColors"
                    placeholder="Red, Blue, Green, Black"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate colors with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productMaterials">Materials</Label>
                  <Input
                    id="productMaterials"
                    name="productMaterials"
                    placeholder="Cotton, Polyester, Leather"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate materials with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <ImageUpload
              ref={imageUploadRef}
              imageUrls={imageUrls}
              onImagesChange={setImageUrls}
              disabled={isLoading}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading
                  ? "Saving..."
                  : product
                  ? "Update Product"
                  : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
