import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../../admin/ui/card";
import { Button } from "../../admin/ui/button";
import { Badge } from "../../admin/ui/badge";
import { Package, MoreVertical, Trash2, Eye, Edit } from "lucide-react";

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

interface ProductListProps {
  products: Product[];
  showSellerColumn?: boolean;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  showSellerColumn,
  onEdit,
  onView,
  onDelete,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (productId: string) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
                  Category
                </th>
                <th className="text-left p-4 font-medium text-card-foreground">
                  Stock
                </th>
                <th className="text-left p-4 font-medium text-card-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={showSellerColumn ? 6 : 5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {product.images ? (
                            <img
                              src={
                                typeof product.images === "string"
                                  ? JSON.parse(product.images)[0]
                                  : product.images[0]
                              }
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-image.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-card-foreground truncate">
                            {product.title}
                          </p>
                          {product.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">
                              {product.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    {showSellerColumn && (
                      <td className="p-4 text-muted-foreground">N/A</td>
                    )}
                    <td className="p-4 text-card-foreground">
                      ${product.price}
                    </td>
                    <td className="p-4 text-card-foreground">
                      {product.category_id
                        ? product.category_id.substring(0, 8) + "..."
                        : "No Category"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={product.outofstock ? "outOfStock" : "default"}
                      >
                        {product.outofstock ? "Out of stock" : "In stock"}
                      </Badge>
                    </td>
                    <td className="p-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDropdown(product.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {openDropdown === product.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-4 top-12 z-50 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1"
                        >
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              onView?.(product);
                              setOpenDropdown(null);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              onEdit?.(product);
                              setOpenDropdown(null);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
                            onClick={() => {
                              onDelete?.(product.id);
                              setOpenDropdown(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
