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
export const useSalesData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderProducts, setOrderProducts] = useState<{
    [key: string]: Product;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrdersWithProducts = async () => {
      console.log("🔍 Loading sales data for all orders (no user filtering)");
      setLoading(true);

      try {
        console.log("🔍 Fetching order_items with orders data...");

        // Step 1: Fetch order_items with orders data (only delivered orders for sales count)
        const { data: orderItemsData, error: orderItemsError } =
          await supabase.from("order_items").select(`
            id,
            order_id,
            product_id,
            quantity,
            price,
            created_at,
            orders!inner (
              id,
              status,
              created_at
            )
          `);

        if (orderItemsError) {
          console.error("❌ Error loading order items:", orderItemsError);
          setLoading(false);
          return;
        }

        console.log("✅ Order items loaded:", orderItemsData?.length || 0);

        // Since there's no seller_id in orders table, show all order items
        // In the future, you can add seller_id column or filter by product ownership
        const filteredOrderItems = orderItemsData || [];

        console.log(
          "📋 All order items (no seller filtering):",
          filteredOrderItems.length
        );

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

        console.log(
          "� Sales order items (confirmed/completed/delivered/paid):",
          salesOrderItems.length
        );

        // Step 2: Extract unique product_ids from ALL orders (not just sales)
        const allProductIds = [
          ...new Set(filteredOrderItems.map((item: any) => item.product_id)),
        ];
        console.log("🎯 All unique product IDs needed:", allProductIds);

        const salesProductIds = [
          ...new Set(salesOrderItems.map((item: any) => item.product_id)),
        ];
        console.log("💰 Sales product IDs:", salesProductIds);

        // Step 3: FIX UUID/integer mismatch with smart mapping
        let productsData: Product[] = [];
        const productMap: { [key: string]: Product } = {};

        if (allProductIds.length > 0) {
          console.log("� Fixing UUID/integer mismatch...");
          console.log("🎯 Order product IDs (integers):", allProductIds);

          // Get all products ordered by creation time to match with integer indices
          const { data: allProducts, error: allProductsError } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: true });

          if (allProductsError) {
            console.error("❌ Error fetching products:", allProductsError);
          } else if (allProducts && allProducts.length > 0) {
            console.log("📋 Found", allProducts.length, "products in database");
            console.log("� Sample product:", allProducts[0]);

            // Map integer IDs to products based on creation order
            // Integer "1" = 1st product, "2" = 2nd product, etc.
            allProductIds.forEach((integerIdStr) => {
              const integerIndex = parseInt(integerIdStr) - 1; // Convert to 0-based index
              if (integerIndex >= 0 && integerIndex < allProducts.length) {
                const product = allProducts[integerIndex];
                productMap[integerIdStr] = product;
                console.log(
                  `✅ Mapped ID ${integerIdStr} -> "${product.title}"`
                );
              } else {
                console.log(
                  `❌ No product at index ${integerIndex} for ID ${integerIdStr}`
                );
              }
            });

            console.log(
              "📚 Product mapping complete:",
              Object.keys(productMap).length,
              "mapped"
            );
          } else {
            console.log("⚠️ No products found in database");
          }
        }

        // Step 5: Build orders array for rendering (using all filtered items for display)
        const ordersArray: Order[] = filteredOrderItems.map((item: any) => ({
          id: `${item.orders.id}-${item.product_id}`, // Unique identifier
          order_id: item.orders.id,
          product_id: item.product_id,
          quantity: item.quantity,
          amount: parseFloat(item.price) * item.quantity,
          status: item.orders.status,
          created_at: item.orders.created_at,
        }));

        console.log("📈 All orders array built:", ordersArray.length, "orders");
        console.log("📋 Sample order:", ordersArray[0]);

        // Build sales orders array (only confirmed/completed orders for sales metrics)
        const salesArray: Order[] = salesOrderItems.map((item: any) => ({
          id: `${item.orders.id}-${item.product_id}`,
          order_id: item.orders.id,
          product_id: item.product_id,
          quantity: item.quantity,
          amount: parseFloat(item.price) * item.quantity,
          status: item.orders.status,
          created_at: item.orders.created_at,
        }));

        console.log("💰 Sales orders array:", salesArray.length, "sales");

        // Log all order statuses for debugging
        const statusCounts = ordersArray.reduce((acc: any, order) => {
          const status = order.status?.toLowerCase() || "unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        console.log("📊 Order status breakdown:", statusCounts);

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
  }, []); // Remove userId dependency

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
