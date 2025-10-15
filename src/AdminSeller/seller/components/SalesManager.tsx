import React, { useState, useEffect } from "react";
import { Badge } from "../../admin/ui/badge";
import supabase from "../../../supabase";

// Order type for sales functionality
export type Order = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  amount: number;
  status: string;
  created_at: string;
};

// Product type for lookup
export type Product = {
  id: string;
  title: string;
  price: string;
  images?: string;
};

// Sales data hook
export const useSalesData = (sellerId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderProducts, setOrderProducts] = useState<{
    [key: string]: Product;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrdersWithProducts = async () => {
      if (!sellerId) {
        setOrders([]);
        setOrderProducts({});
        setLoading(false);
        return;
      }
      console.log("🔍 Loading sales data for seller", sellerId);
      setLoading(true);

      try {
        // Step 1: Get all seller_product_ids owned by this seller
        const { data: spRows, error: spErr } = await supabase
          .from("seller_products")
          .select("seller_product_id, product_id")
          .eq("seller_id", sellerId);
        if (spErr) {
          console.error("❌ Error fetching seller_products:", spErr);
          setLoading(false);
          return;
        }

        const sellerProductIds = (spRows || []).map(
          (r: any) => r.seller_product_id
        );
        const sellerProductIdSet = new Set(sellerProductIds);
        console.log("🧾 seller_product_ids:", sellerProductIds.length);

        if (sellerProductIds.length === 0) {
          setOrders([]);
          setOrderProducts({});
          setLoading(false);
          return;
        }

        // Step 2: Fetch order_items for only those seller_product_ids, join orders for status
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from("order_items")
          .select(
            `
            id,
            order_id,
            product_id,
            seller_product_id,
            quantity,
            price,
            created_at,
            orders!inner (
              id,
              status,
              created_at
            )
          `
          )
          .in("seller_product_id", sellerProductIds);

        if (orderItemsError) {
          console.error("❌ Error loading order items:", orderItemsError);
          setLoading(false);
          return;
        }

        const filteredOrderItems = (orderItemsData || []).filter((it: any) =>
          sellerProductIdSet.has(it.seller_product_id)
        );
        console.log("✅ Order items loaded:", filteredOrderItems.length);

        // Filter by status for sales count (confirmed, completed, delivered, paid)
        const salesOrderItems = filteredOrderItems.filter((item: any) => {
          const status = item.orders?.status?.toLowerCase();
          return (
            status === "confirmed" ||
            status === "delivered" ||
            status === "completed" ||
            status === "paid"
          );
        });

        // Step 3: Build product map directly from product UUIDs
        const uuidProductIds = [
          ...new Set(filteredOrderItems.map((item: any) => item.product_id)),
        ];
        const productMap: { [key: string]: Product } = {};
        if (uuidProductIds.length > 0) {
          const { data: prodRows, error: prodErr } = await supabase
            .from("products")
            .select("id, title, price, images")
            .in("id", uuidProductIds);
          if (prodErr) {
            console.error("❌ Error fetching products:", prodErr);
          } else {
            (prodRows || []).forEach((p: any) => {
              productMap[p.id] = p as Product;
            });
          }
        }

        // Step 4: Build orders array for rendering
        const ordersArray: Order[] = filteredOrderItems.map((item: any) => ({
          id: `${item.orders.id}-${item.product_id}-${item.seller_product_id}`,
          order_id: item.orders.id,
          product_id: item.product_id,
          quantity: item.quantity,
          amount: parseFloat(item.price) * item.quantity,
          status: item.orders.status,
          created_at: item.orders.created_at,
        }));

        // Build sales orders array (only confirmed/completed orders for sales metrics)
        const salesArray: Order[] = salesOrderItems.map((item: any) => ({
          id: `${item.orders.id}-${item.product_id}-${item.seller_product_id}`,
          order_id: item.orders.id,
          product_id: item.product_id,
          quantity: item.quantity,
          amount: parseFloat(item.price) * item.quantity,
          status: item.orders.status,
          created_at: item.orders.created_at,
        }));

        // Store both all orders and sales orders
        setOrders(ordersArray);
        setOrderProducts(productMap);
        setLoading(false);

        console.log("🎯 === FINAL SUMMARY ===");
        console.log(`📦 Total Orders: ${ordersArray.length}`);
        console.log(`💰 Sales Orders: ${salesArray.length}`);
        console.log(`🛍️ Products: ${Object.keys(productMap).length}`);
        console.log(
          `💵 Sales Revenue: $${salesArray.reduce(
            (sum, order) => sum + order.amount,
            0
          )}`
        );
      } catch (error) {
        console.error("💥 Error loading orders with products:", error);
        setLoading(false);
      }
    };

    loadOrdersWithProducts();
  }, [sellerId]);

  // Calculate sales orders for metrics (confirmed, completed, delivered, paid)
  const salesOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase();
    return (
      status === "confirmed" ||
      status === "delivered" ||
      status === "completed" ||
      status === "paid"
    );
  });

  const calculatedTotalSales = salesOrders.length;
  const calculatedTotalRevenue = salesOrders.reduce(
    (sum: number, order: Order) => sum + order.amount,
    0
  );

  console.log("💰 Final Sales Metrics:", {
    totalOrders: orders.length,
    salesOrders: salesOrders.length,
    totalSales: calculatedTotalSales,
    totalRevenue: calculatedTotalRevenue,
  });

  return {
    orders,
    deliveredOrders: salesOrders, // Return sales orders as deliveredOrders for compatibility
    orderProducts,
    loading,
    totalSales: calculatedTotalSales,
    totalRevenue: calculatedTotalRevenue,
  };
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

// Helper function to get badge variant based on status
export const getBadgeVariant = (
  status: string
): "default" | "completed" | "pending" | "inactive" | "outOfStock" => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "delivered":
      return "completed";
    case "pending":
    case "processing":
      return "pending";
    case "cancelled":
    case "failed":
      return "inactive";
    default:
      return "default";
  }
};

// Component for displaying product name with fallback
interface ProductNameProps {
  productId: string;
  orderProducts: { [key: string]: Product };
  className?: string;
}

export const ProductName: React.FC<ProductNameProps> = ({
  productId,
  orderProducts,
  className = "",
}) => {
  const productTitle = orderProducts[productId]?.title;

  return (
    <span className={className}>
      {productTitle || `Unknown Product (ID: ${productId})`}
    </span>
  );
};

// Component for displaying order status badge
interface OrderStatusProps {
  status: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  return <Badge variant={getBadgeVariant(status)}>{status}</Badge>;
};

// Recent Sales List Component
interface RecentSalesListProps {
  orders: Order[];
  orderProducts: { [key: string]: Product };
  loading: boolean;
  maxItems?: number;
}

export const RecentSalesList: React.FC<RecentSalesListProps> = ({
  orders,
  orderProducts,
  loading,
  maxItems = 3,
}) => {
  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading sales...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No recent sales
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.slice(0, maxItems).map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-card-foreground">
              <ProductName
                productId={order.product_id}
                orderProducts={orderProducts}
              />
            </p>
            <p className="text-sm text-muted-foreground">
              Order: {order.order_id.slice(0, 8)}... |{" "}
              {formatDate(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-card-foreground">
              Rs{order.amount.toFixed(2)} (Qty: {order.quantity})
            </p>
            <OrderStatus status={order.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Sales Table Component
interface SalesTableProps {
  orders: Order[];
  orderProducts: { [key: string]: Product };
  loading: boolean;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  orders,
  orderProducts,
  loading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr>
            <th className="text-left p-4 font-medium text-card-foreground">
              Order ID
            </th>
            <th className="text-left p-4 font-medium text-card-foreground">
              Product
            </th>
            <th className="text-left p-4 font-medium text-card-foreground">
              Quantity
            </th>
            <th className="text-left p-4 font-medium text-card-foreground">
              Amount
            </th>
            <th className="text-left p-4 font-medium text-card-foreground">
              Date
            </th>
            <th className="text-left p-4 font-medium text-card-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                Loading sales...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No recent sales
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-b border-border">
                <td className="p-4 text-card-foreground">
                  {order.order_id.slice(0, 8)}...
                </td>
                <td className="p-4 text-card-foreground">
                  <ProductName
                    productId={order.product_id}
                    orderProducts={orderProducts}
                  />
                </td>
                <td className="p-4 text-card-foreground">{order.quantity}</td>
                <td className="p-4 text-card-foreground">
                  Rs{order.amount.toFixed(2)}
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(order.created_at)}
                </td>
                <td className="p-4">
                  <OrderStatus status={order.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
