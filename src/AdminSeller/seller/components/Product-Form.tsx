import React, { useState, useRef, useEffect } from "react";
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
  variant: {
    sizes?: string[];
    colors?: string[];
    materials?: string[];
  };
  outofstock: boolean;
  brand_id: number;
  created_at?: string;
  updated_at?: string;
};

type Brand = {
  brand_id: number;
  brand_name: string;
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
  const [stockQuantity, setStockQuantity] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState(""); // <-- string

  const [materials, setMaterials] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string; category_id: string }[]
  >([]);
  const [subsubcategories, setSubsubcategories] = useState<
    { id: string; name: string; subcategory_id: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    product?.category_id || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    product?.subcategory_id || ""
  );
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState<string>(
    product?.subsubcategory_id || ""
  );

  // Preload existing images when editing
  useEffect(() => {
    if (!product) return;
    try {
      const imgs =
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images;
      if (Array.isArray(imgs)) {
        setImageUrls(imgs.slice(0, 4));
      } else if (
        typeof product.images === "string" &&
        product.images.startsWith("http")
      ) {
        setImageUrls([product.images]);
      }
    } catch {
      // ignore parse issues
    }
  }, [product]);

  // Hydrate seller-specific stock on edit from seller_products
  useEffect(() => {
    const loadSellerStock = async () => {
      try {
        if (!product?.id) return;
        const auth = await supabase.auth.getUser();
        const uid = user?.id || auth.data?.user?.id;
        if (!uid) return;
        const { data: sellerRow } = await supabase
          .from("sellers")
          .select("seller_id")
          .eq("user_id", uid)
          .single();
        const currentSellerId = sellerRow?.seller_id;
        if (!currentSellerId) return;
        const { data: spRows } = await supabase
          .from("seller_products")
          .select("stock")
          .eq("seller_id", currentSellerId)
          .eq("product_id", product.id)
          .limit(1);
        if (spRows && spRows.length > 0) {
          const s = Number(spRows[0].stock ?? 0);
          if (!Number.isNaN(s)) setStockQuantity(s);
        }
      } catch (e) {
        // non-fatal
      }
    };
    loadSellerStock();
  }, [product, user]);
  // Load categories from DB
  React.useEffect(() => {
    const loadCats = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true });
        if (error) {
          console.error("Failed to load categories:", error);
          return;
        }
        setCategories(data || []);
      } catch (err) {
        console.error("Unexpected error loading categories:", err);
      }
    };
    loadCats();
  }, []);

  // Load subcategories when selectedCategory changes
  React.useEffect(() => {
    const loadSubs = async () => {
      setSubcategories([]);
      setSubsubcategories([]);
      setSelectedSubcategory("");
      setSelectedSubsubcategory("");
      if (!selectedCategory) return;
      try {
        const { data, error } = await supabase
          .from("subcategories")
          .select("id, name, category_id")
          .eq("category_id", selectedCategory)
          .order("name", { ascending: true });
        if (error) {
          console.error("Failed to load subcategories:", error);
          return;
        }
        setSubcategories(data || []);
      } catch (err) {
        console.error("Unexpected error loading subcategories:", err);
      }
    };
    loadSubs();
  }, [selectedCategory]);

  // Load subsubcategories when selectedSubcategory changes
  React.useEffect(() => {
    const loadSubSubs = async () => {
      setSubsubcategories([]);
      setSelectedSubsubcategory("");
      if (!selectedSubcategory) return;
      try {
        const { data, error } = await supabase
          .from("subsubcategories")
          .select("id, name, subcategory_id")
          .eq("subcategory_id", selectedSubcategory)
          .order("name", { ascending: true });
        if (error) {
          console.error("Failed to load sub-subcategories:", error);
          return;
        }
        setSubsubcategories(data || []);
      } catch (err) {
        console.error("Unexpected error loading sub-subcategories:", err);
      }
    };
    loadSubSubs();
  }, [selectedSubcategory]);

  // Load brands for dropdown
  React.useEffect(() => {
    const loadBrands = async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("brand_id, brand_name")
          .order("brand_name", { ascending: true });
        if (error) {
          console.error("Failed to load brands:", error);
          return;
        }
        setBrands(data || []);
      } catch (err) {
        console.error("Unexpected error loading brands:", err);
      }
    };
    loadBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("productTitle") as string;
    const description = formData.get("productDescription") as string;
    const price = formData.get("productPrice") as string;
    const category =
      selectedCategory || (formData.get("productCategory") as string);
    const subcategory =
      selectedSubcategory || (formData.get("productSubcategory") as string);
    const subsubcategory =
      selectedSubsubcategory ||
      (formData.get("productSubsubcategory") as string);

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

    // Ensure we never persist more than 4 images; index 0 is primary
    const cappedImages = (imageUrls || []).slice(0, 4);

    const productData = {
      title: title.trim(),
      subtitle: (formData.get("productSubtitle") as string)?.trim() || null,
      description: description.trim(),
      price: parseFloat(price).toFixed(2),
      old_price: (formData.get("productOldPrice") as string) || "0.00",
      rating: "0.00",
      reviews: parseInt((formData.get("productReviews") as string) || "0"),
      images: JSON.stringify(cappedImages),
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
      category_id: category || null,
      subcategory_id: subcategory || null,
      subsubcategory_id: subsubcategory || null,
      brand_id: parseInt((formData.get("productBrand") as string) || "1"),
    };

    setIsLoading(true);
    try {
      if (product?.id) {
        // Upload images first (if any new ones), else keep current imageUrls
        let finalImageUrls = (imageUrls || []).slice(0, 4);
        if (imageUploadRef.current) {
          const uploaded = await imageUploadRef.current.uploadAllImages();
          if (uploaded && uploaded.length) {
            finalImageUrls = uploaded.slice(0, 4);
          }
        }
        productData.images = JSON.stringify(finalImageUrls);

        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;

        // Update seller_products price & stock for current seller
        try {
          const auth = await supabase.auth.getUser();
          const uid = user?.id || auth.data?.user?.id;
          if (uid) {
            const { data: sellerRow } = await supabase
              .from("sellers")
              .select("seller_id")
              .eq("user_id", uid)
              .single();
            const currentSellerId = sellerRow?.seller_id;
            if (currentSellerId) {
              const { data: spExisting } = await supabase
                .from("seller_products")
                .select("seller_product_id")
                .eq("seller_id", currentSellerId)
                .eq("product_id", product.id)
                .limit(1);
              if (spExisting && spExisting.length > 0) {
                await supabase
                  .from("seller_products")
                  .update({
                    price: parseFloat(productData.price),
                    stock: stockQuantity,
                  })
                  .eq("seller_id", currentSellerId)
                  .eq("product_id", product.id);
              } else {
                await supabase.from("seller_products").insert([
                  {
                    seller_id: currentSellerId,
                    product_id: product.id,
                    price: parseFloat(productData.price),
                    stock: stockQuantity,
                  },
                ]);
              }
            }
          }
        } catch (e) {
          console.warn("seller_products upsert on edit failed:", e);
        }

        alert("Product updated successfully!");
      } else {
        // Upload images first
        let finalImageUrls = (imageUrls || []).slice(0, 4);
        if (imageUploadRef.current) {
          const uploaded = await imageUploadRef.current.uploadAllImages();
          finalImageUrls = (
            uploaded && uploaded.length ? uploaded : finalImageUrls
          ).slice(0, 4);
        }
        productData.images = JSON.stringify(finalImageUrls);

        // Helpers to link product to seller_products (schema: seller_id, product_id, price, stock)
        const getSellerId = async (): Promise<number | null> => {
          try {
            const auth = await supabase.auth.getUser();
            const uid = user?.id || auth.data?.user?.id;
            if (!uid) return null;
            const { data: sellerRow, error: sellerErr } = await supabase
              .from("sellers")
              .select("seller_id")
              .eq("user_id", uid)
              .single();
            if (sellerErr) {
              console.warn("Could not fetch seller_id:", sellerErr.message);
              return null;
            }
            return sellerRow?.seller_id ?? null;
          } catch (e) {
            console.warn("getSellerId failed:", e);
            return null;
          }
        };

        const linkSellerProduct = async (newProductId?: string | null) => {
          try {
            if (!newProductId) return;
            const sellerId = await getSellerId();
            if (!sellerId) return;
            const payload = {
              seller_id: sellerId,
              product_id: newProductId,
              price: parseFloat(productData.price),
              stock: stockQuantity,
            } as const;
            const { error: spErr } = await supabase
              .from("seller_products")
              .insert([payload]);
            if (spErr) {
              console.warn("seller_products insert failed:", spErr.message);
            }
          } catch (e) {
            console.warn("linkSellerProduct failed:", e);
          }
        };

        const { data: insertedProduct, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

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

            const { data: minimalInserted, error: retryError } = await supabase
              .from("products")
              .insert([minimalProductData])
              .select()
              .single();
            if (retryError) throw retryError;

            // Link to seller_products per schema
            await linkSellerProduct(minimalInserted?.id);

            alert(
              "Product added successfully! (Note: Category information was not saved due to database constraints)"
            );
          } else {
            throw error;
          }
        } else {
          // Link to seller_products per schema
          await linkSellerProduct(insertedProduct?.id);
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

  // categories are loaded dynamically via Supabase

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
                    value={selectedCategory}
                    onValueChange={(val) => setSelectedCategory(val)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productSubcategory">Subcategory</Label>
                  <Select
                    name="productSubcategory"
                    value={selectedSubcategory}
                    onValueChange={(val) => setSelectedSubcategory(val)}
                    disabled={!selectedCategory || subcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      {subcategories.map((sc) => (
                        <SelectItem key={sc.id} value={sc.id}>
                          {sc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productSubsubcategory">Sub-Subcategory</Label>
                  <Select
                    name="productSubsubcategory"
                    value={selectedSubsubcategory}
                    onValueChange={(val) => setSelectedSubsubcategory(val)}
                    disabled={
                      !selectedSubcategory || subsubcategories.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sub-subcategory" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      {subsubcategories.map((ssc) => (
                        <SelectItem key={ssc.id} value={ssc.id}>
                          {ssc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productBrand">Brand</Label>
                  {brands.length > 0 ? (
                    <Select
                      name="productBrand"
                      defaultValue={
                        product?.brand_id ? String(product.brand_id) : ""
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                        {brands.map((b) => (
                          <SelectItem
                            key={b.brand_id}
                            value={String(b.brand_id)}
                          >
                            {b.brand_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="productBrand"
                      name="productBrand"
                      type="number"
                      defaultValue={product?.brand_id || 1}
                      placeholder="Enter brand ID"
                    />
                  )}
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
                    <input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setStockQuantity(value);
                        }
                      }}
                      min={0}
                      className="no-spinner w-20  text-black text-center focus:outline-none focus:ring-0"
                      placeholder="Stock"
                    />
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
                    defaultValue={product?.variant?.sizes?.join(", ") || ""}
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
                    defaultValue={product?.variant?.colors?.join(", ") || ""}
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
                    defaultValue={product?.variant?.materials?.join(", ") || ""}
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
