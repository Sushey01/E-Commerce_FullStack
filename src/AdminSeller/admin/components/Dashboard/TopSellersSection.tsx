import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Star } from "lucide-react";

export interface Seller {
  seller_id: string;
  company_name: string;
  rating?: number;
  totalSales?: number;
  totalRevenue?: number;
}
export interface Product {
  product_id: string;
  products?: { title?: string };
  price?: number;
  totalQuantity?: number;
}

interface TopSellersSectionProps {
  topSellers: Seller[];
  topProducts: Product[];
}

export default function TopSellersSection({
  topSellers,
  topProducts,
}: TopSellersSectionProps) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">
          Top Sellers & Products
        </CardTitle>
        <p className="text-xs text-gray-500">
          Based on total sales & order quantity
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSellers.length > 0 ? (
            topSellers.slice(0, 3).map((seller, idx) => (
              <div
                key={seller.seller_id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {seller.company_name || "Unknown Seller"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < (seller.rating || 4)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        • {seller.totalSales || 0} items sold
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-bold text-green-600">
                      ${seller.totalRevenue?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                {/* Top products from this seller */}
                <div className="pl-10 space-y-1">
                  {topProducts.slice(idx * 2, idx * 2 + 2).map((product) => (
                    <div
                      key={product.product_id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-600 truncate">
                        {product.products?.title || "Product"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">
                          Sold: {product.totalQuantity || 0}
                        </span>
                        <span className="text-gray-900 font-bold">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No sellers yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
