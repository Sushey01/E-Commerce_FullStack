import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";

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
  image?: string | null;
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
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);
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
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100" />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {product.category || "-"}
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
                    <div className="relative inline-block text-left">
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() =>
                          setOpenMenu((prev) =>
                            prev === product.id ? null : product.id
                          )
                        }
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      {openMenu === product.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => {
                              setOpenMenu(null);
                              onView?.(product);
                            }}
                          >
                            <Eye className="h-4 w-4" /> View
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit?.(product);
                            }}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => {
                              setOpenMenu(null);
                              // placeholder delete handler
                              console.log("Delete", product);
                            }}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
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
