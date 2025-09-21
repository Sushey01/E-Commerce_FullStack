import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// Placeholder types and hooks
type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  sellerId: string;
  sellerName: string;
};

const useProducts = () => ({
  addProduct: (productData: Omit<Product, "id">) => {
    console.log("Adding product:", productData);
  },
  updateProduct: (id: string, productData: Partial<Product>) => {
    console.log("Updating product:", id, productData);
  },
});

const useAuth = () => ({
  user: { id: "user123", name: "John Doe" },
});

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProductForm({
  product,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const { user } = useAuth();
  const { addProduct, updateProduct } = useProducts();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: product?.category || "",
    description: product?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.stock || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const productData = {
        name: formData.name.trim(),
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        description: formData.description.trim(),
        sellerId: user?.id || "",
        sellerName: user?.name || "",
      };

      if (product) {
        updateProduct(product.id, productData);
      } else {
        addProduct(productData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {product
            ? "Update product information"
            : "Create a new product listing"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
