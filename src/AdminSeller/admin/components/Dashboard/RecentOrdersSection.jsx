import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../../ui/badge";
import PropTypes from "prop-types";

export default function RecentOrdersSection({ recentOrders = [] }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Order #{order.id?.toString().substring(0, 8)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.seller_name || "Unknown Seller"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "Recent order"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ${Number(order.total || 0).toFixed(2)}
                  </p>
                  <Badge
                    variant={
                      order.status === "Confirmed"
                        ? "default"
                        : order.status === "Pending" ||
                          order.status === "Payment Pending"
                        ? "pending"
                        : "inactive"
                    }
                    className="text-xs mt-1"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent orders
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

RecentOrdersSection.propTypes = {
  recentOrders: PropTypes.array,
};
