import { useState, useEffect } from "react";
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
import supabase from "../../supabase";

// Product type matching your database schema
type Product = {
  id: string;
  category_id: string;
  subcategory_id: string;
  subsubcategory_id: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: string;
  old_price: string;
  rating: string;
  reviews: number;
  images: string;
  variant: string;
  outofstock: boolean;
  created_at: string;
  updated_at: string;
  brand_id: number;
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      console.log("Loading products from database...");
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Error loading products:", error);
        return;
      }

      console.log("Products loaded:", data);
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Error deleting product:", error);
        alert(`Error deleting product: ${error.message}`);
        return;
      }

      // Refresh products list
      loadProducts();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return { products, deleteProduct, loadProducts };
};

const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        setUser({
          ...authUser,
          role: profile?.role || "admin",
        });
      }
    };
    getUser();
  }, []);

  return { user };
};

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
  const { products: hookProducts, deleteProduct, loadProducts } = useProducts();
  const products = propProducts || hookProducts;
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Load products on component mount if no products provided via props
  useEffect(() => {
    if (!propProducts) {
      loadProducts();
    }
  }, [propProducts]);

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    // Search filter - search in title and description
    if (
      searchTerm &&
      !product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter - using category_id for now
    if (
      categoryFilter !== "all" &&
      !product.category_id.includes(categoryFilter)
    ) {
      return false;
    }

    // Stock filter
    if (stockFilter === "in-stock" && product.outofstock) {
      return false;
    }
    if (stockFilter === "out-of-stock" && !product.outofstock) {
      return false;
    }

    return true;
  });

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      deleteProduct(product.id);
    }
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category_id.substring(0, 8)))
  );

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
                          {product.title}
                        </p>
                        {product.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {product.subtitle}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    {showSellerColumn && (
                      <td className="p-4 text-muted-foreground">N/A</td>
                    )}
                    <td className="p-4 text-card-foreground">
                      ${parseFloat(product.price).toFixed(2)}
                      {product.old_price &&
                        parseFloat(product.old_price) > 0 && (
                          <span className="text-xs text-muted-foreground ml-2 line-through">
                            ${parseFloat(product.old_price).toFixed(2)}
                          </span>
                        )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.outofstock ? "outOfStock" : "completed"
                        }
                      >
                        {product.outofstock ? "Out of stock" : "In stock"}
                      </Badge>
                    </td>
                    <td className="p-4 text-card-foreground">
                      {product.category_id.substring(0, 8)}...
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
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
