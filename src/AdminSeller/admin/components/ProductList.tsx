import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

type Product = {
  id: string | number;
  name: string;
  price: number;
  category?: string;
  description?: string;
  sellerId?: string;
  stock: number;
  seller?: string;
  brand?: string;
};

export default function ProductList({
  productsParam,
  showSellerColumn,
  onEdit,
  onView,
}: {
  productsParam?: Product[];
  showSellerColumn?: boolean;
  onEdit?: (product: any) => void;
  onView?: (product: any) => void;
}) {
  const productsToRender = productsParam || [];
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Stock</th>
                {showSellerColumn && (
                  <th className="text-left p-4 font-medium">Seller</th>
                )}
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsToRender.map((product) => (
                <tr key={product.id} className="border-b border-border">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">
                    <Badge
                      variant={product.stock > 0 ? "default" : "outOfStock"}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </Badge>
                  </td>
                  {showSellerColumn && (
                    <td className="p-4 text-muted-foreground">
                      {(product as any).seller}
                    </td>
                  )}
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
