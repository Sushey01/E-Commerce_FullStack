import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Eye, Edit, Trash2, Search } from "lucide-react";

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
  products: [] as Product[],
  deleteProduct: (id: string) => {
    console.log("Deleting product:", id);
  },
});

const useAuth = () => ({
  user: { id: "user123", role: "admin" as "admin" | "seller" },
});

interface ProductListProps {
  products?: Product[];
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  showSellerColumn?: boolean;
}

export default function ProductList({
  products: propProducts,
  onEdit,
  onView,
  showSellerColumn = false,
}: ProductListProps) {
  const { user } = useAuth();
  const { deleteProduct } = useProducts();
  const products = propProducts || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Filter products based on user role
  const filteredProducts = products
    .filter((product) => {
      // If seller, only show their products
      if (user?.role === "seller" && product.sellerId !== user.id) {
        return false;
      }
      return true;
    })
    .filter((product) => {
      // Search filter
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }

      // Stock filter
      if (stockFilter === "in-stock" && product.stock === 0) {
        return false;
      }
      if (stockFilter === "out-of-stock" && product.stock > 0) {
        return false;
      }
      if (stockFilter === "low-stock" && product.stock > 10) {
        return false;
      }

      return true;
    });

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Stock Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock (≤10)</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Product
                  </th>
                  {showSellerColumn && (
                    <th className="text-left p-4 font-medium text-card-foreground">
                      Seller
                    </th>
                  )}
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Price
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Stock
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Category
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    {showSellerColumn && (
                      <td className="p-4 text-muted-foreground">
                        {product.sellerName}
                      </td>
                    )}
                    <td className="p-4 text-card-foreground">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.stock === 0
                            ? "destructive"
                            : product.stock <= 10
                            ? "secondary"
                            : "default"
                        }
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : product.stock <= 10
                          ? `${product.stock} left`
                          : product.stock}
                      </Badge>
                    </td>
                    <td className="p-4 text-card-foreground">
                      {product.category}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit &&
                          (user?.role === "admin" ||
                            product.sellerId === user?.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        {(user?.role === "admin" ||
                          product.sellerId === user?.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
