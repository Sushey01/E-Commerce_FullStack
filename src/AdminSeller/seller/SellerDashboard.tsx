import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../admin/ui/card";
import { Button } from "../admin/ui/button";
import { Badge } from "../admin/ui/badge";
import { Input } from "../admin/ui/input";
import { Label } from "../admin/ui/label";
import { Textarea } from "../admin/ui/textarea";

import {
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  ShoppingCart,
  Eye,
  Star,
  ArrowUp,
  ArrowDown,
  Package2,
  Users,
  CreditCard,
  Activity,
} from "lucide-react";
import ProductForm from "./components/Product-Form";
import ProductList from "./components/ProductList";
import {
  useSalesData,
  RecentSalesList,
  SalesTable,
} from "./components/SalesManager";
import supabase from "../../supabase";
import { Navigate, useNavigate } from "react-router-dom";

// Local product type for dashboard tables (matches ProductList expectations)
type DashboardProduct = {
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
  variant: string; // stored as JSON string in DB for listing table
  outofstock: boolean;
  created_at: string;
  updated_at: string;
  brand_id: number;
};

// Real auth hook using Supabase
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        if (isMounted) setUser(null);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      // Fetch seller_id for this user (if exists)
      let sellerId: string | undefined = undefined;
      try {
        const { data: sellerRow } = await supabase
          .from("sellers")
          .select("seller_id, status")
          .eq("user_id", authUser.id)
          .single();
        sellerId = sellerRow?.seller_id;
        if (isMounted) {
          // include status in user object later
        }
        if (isMounted && sellerRow?.status) {
          // no-op; handled below when setting user
        }
      } catch {}

      if (isMounted) {
        setUser({
          id: authUser.id,
          seller_id: sellerId,
          name: profile?.full_name || authUser.email,
          email: authUser.email,
          email_confirmed_at: (authUser as any)?.email_confirmed_at || null,
          seller_status: await (async () => {
            try {
              const { data: s } = await supabase
                .from("sellers")
                .select("status")
                .eq("user_id", authUser.id)
                .single();
              return s?.status;
            } catch {
              return undefined;
            }
          })(),
          ...profile,
        });
      }
    };

    // Initial load
    loadUser();

    // Subscribe to auth state changes to keep seller_id fresh
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        loadUser();
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  return { user };
};

// Sample products - start with empty array, will load from database
const sampleProducts: DashboardProduct[] = [];

// Products hook with database loading
const useProducts = () => {
  const [products, setProducts] = useState<DashboardProduct[]>(sampleProducts);

  const loadProducts = async (sellerId?: string) => {
    try {
      if (sellerId) {
        // Only load products that belong to this seller via seller_products
        const { data, error } = await supabase
          .from("seller_products")
          .select("product:products(*)")
          .eq("seller_id", sellerId);

        if (error) {
          console.error("Error loading seller products:", error);
          return;
        }

        const sellerProds = (data || [])
          .map((row: any) => row.product)
          .filter(Boolean) as DashboardProduct[];
        setProducts(sellerProds);
      } else {
        // No seller context on seller dashboard; show nothing to avoid leaking global products
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const getProductsBySeller = (sellerId: string) => {
    return products; // Already filtered by loadProducts(sellerId)
  };

  return { products, getProductsBySeller, loadProducts };
};

// ProductList component moved to separate file

// AnalyticsCharts component with real data
const AnalyticsCharts = ({
  userRole,
  orders,
  orderProducts,
}: {
  userRole?: string;
  orders: any[];
  orderProducts: { [key: string]: any };
}) => {
  // Generate pie chart data for product sales distribution
  const generatePieChartData = () => {
    const productSales: {
      [key: string]: { name: string; count: number; revenue: number };
    } = {};

    orders.forEach((order) => {
      const productId = order.product_id;
      const productName =
        orderProducts[productId]?.title || `Product ${productId}`;
      const quantity = order.quantity || 1;
      const amount = order.amount || 0;

      if (!productSales[productId]) {
        productSales[productId] = { name: productName, count: 0, revenue: 0 };
      }

      productSales[productId].count += quantity;
      productSales[productId].revenue += amount;
    });

    // Convert to array and sort by sales count
    const salesArray = Object.values(productSales).sort(
      (a, b) => b.count - a.count
    );

    // If more than 5 products, group the rest as "Others"
    if (salesArray.length > 5) {
      const top4 = salesArray.slice(0, 4);
      const others = salesArray.slice(4);
      const othersTotal = others.reduce((sum, item) => sum + item.count, 0);
      const othersRevenue = others.reduce((sum, item) => sum + item.revenue, 0);

      return [
        ...top4,
        { name: "Others", count: othersTotal, revenue: othersRevenue },
      ];
    }

    return salesArray;
  };

  const pieData = generatePieChartData();
  const totalSalesCount = pieData.reduce((sum, item) => sum + item.count, 0);

  // Generate colors for pie chart
  const colors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // yellow
    "#8b5cf6", // purple
    "#6b7280", // gray for others
  ];

  // Simple Pie Chart Component
  const SalesChart = () => {
    if (totalSalesCount === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No sales data available</p>
        </div>
      );
    }

    return (
      <div className="h-64 p-4">
        <div className="flex items-center justify-center h-48">
          <div className="relative">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="transform -rotate-90"
            >
              {pieData.map((item, index) => {
                const percentage = (item.count / totalSalesCount) * 100;
                const angle = (percentage / 100) * 360;
                const previousAngles = pieData
                  .slice(0, index)
                  .reduce(
                    (sum, prevItem) =>
                      sum + (prevItem.count / totalSalesCount) * 360,
                    0
                  );

                // Calculate path for pie slice
                const startAngle = (previousAngles * Math.PI) / 180;
                const endAngle = ((previousAngles + angle) * Math.PI) / 180;

                const largeArcFlag = angle > 180 ? 1 : 0;
                const x1 = 100 + 80 * Math.cos(startAngle);
                const y1 = 100 + 80 * Math.sin(startAngle);
                const x2 = 100 + 80 * Math.cos(endAngle);
                const y2 = 100 + 80 * Math.sin(endAngle);

                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  "Z",
                ].join(" ");

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index % colors.length]}
                    className="transition-opacity hover:opacity-80"
                  />
                );
              })}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalSalesCount}</div>
                <div className="text-xs text-muted-foreground">Total Sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate">
                {item.name} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate top products from real order data
  const getTopProducts = () => {
    const productSales: {
      [key: string]: { name: string; count: number; revenue: number };
    } = {};

    orders.forEach((order) => {
      const productId = order.product_id;
      const productName =
        orderProducts[productId]?.title || `Product ${productId}`;
      const quantity = order.quantity || 1;
      const amount = order.amount || 0;

      if (!productSales[productId]) {
        productSales[productId] = { name: productName, count: 0, revenue: 0 };
      }

      productSales[productId].count += quantity;
      productSales[productId].revenue += amount;
    });

    // Sort by quantity sold and return top 3
    return Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const topProducts = getTopProducts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales by Product</CardTitle>
          <CardDescription>
            Distribution of sales across your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Your best selling products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No sales data available
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {product.count} sold
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SellerDashboardProps {
  activeTab: string;
}

export default function SellerDashboard({ activeTab }: SellerDashboardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, getProductsBySeller, loadProducts } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>();

  const sellerId = user?.seller_id;

  // Use the SalesManager hook for all sales data (no user filtering needed)
  const {
    orders,
    deliveredOrders,
    orderProducts,
    loading,
    totalSales,
    totalRevenue,
  } = useSalesData(sellerId);

  // Load products for this seller
  useEffect(() => {
    if (sellerId) {
      loadProducts(sellerId);
    }
  }, [sellerId]);

  const sellerProducts = getProductsBySeller(sellerId || "");
  const totalProducts = sellerProducts.length;

  const handleAddProduct = () => {
    console.log("Adding product:", editingProduct);
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this product from your listings?"
      )
    ) {
      try {
        if (!sellerId) {
          alert("Missing seller context. Please re-login and try again.");
          return;
        }

        // 1) Unlink this product from the current seller (prevents FK violation)
        const { error: unlinkErr } = await supabase
          .from("seller_products")
          .delete()
          .eq("seller_id", sellerId)
          .eq("product_id", productId);
        if (unlinkErr) {
          console.error("Error unlinking seller product:", unlinkErr);
          alert("Failed to remove product from your list.");
          return;
        }

        // 2) If no sellers remain linked to this product, delete the global product row
        const { data: remainingLinks, error: linkErr } = await supabase
          .from("seller_products")
          .select("seller_product_id")
          .eq("product_id", productId)
          .limit(1);
        if (linkErr) {
          console.warn("Could not verify remaining links:", linkErr);
        } else if (!remainingLinks || remainingLinks.length === 0) {
          const { error: prodDelErr } = await supabase
            .from("products")
            .delete()
            .eq("id", productId);
          if (prodDelErr) {
            console.warn("Product cleanup failed:", prodDelErr);
          }
        }

        // Reload products after successful unlink (scoped to current seller)
        await loadProducts(sellerId);
        console.log("Product removed from seller list successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      console.log("Starting profile update...");

      // Get form values with fallbacks
      const fullName =
        (document.getElementById("fullName") as HTMLInputElement)?.value || "";
      const email =
        (document.getElementById("email") as HTMLInputElement)?.value || "";
      const phone =
        (document.getElementById("phone") as HTMLInputElement)?.value || "";
      const businessName =
        (document.getElementById("businessName") as HTMLInputElement)?.value ||
        "";
      const businessCategory =
        (document.getElementById("businessCategory") as HTMLInputElement)
          ?.value || "";
      const businessAddress =
        (document.getElementById("businessAddress") as HTMLTextAreaElement)
          ?.value || "";
      const taxId =
        (document.getElementById("taxId") as HTMLInputElement)?.value || "";

      console.log("Form data:", {
        fullName,
        email,
        phone,
        businessName,
        businessCategory,
        businessAddress,
        taxId,
      });

      if (!user?.id) {
        alert("User not found. Please try logging in again.");
        return;
      }

      console.log("User ID:", user.id);

      // First, try to check if the user exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (checkError) {
        console.error("Error checking user:", checkError);
        alert(`Database error: ${checkError.message}`);
        return;
      }

      console.log("Existing user:", existingUser);

      // Update user profile in Supabase - only fields that exist in the users table
      const updateData = {
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      };

      console.log("Update data:", updateData);

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        alert(`Failed to update profile: ${error.message}`);
        return;
      }

      console.log("Update successful:", data);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Unexpected error:", error);
      alert(`Failed to update profile: ${error.message || "Unknown error"}`);
    }
  };

  const renderDashboard = () => {
    // Calculate growth percentages (mock data for demo)
    const productsGrowth = 12.5;
    const salesGrowth = 8.3;
    const revenueGrowth = 15.2;
    const ordersGrowth = 5.7;

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || "Seller"}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here's what's happening with your store today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm text-blue-100">Total Earnings</div>
                <div className="text-3xl font-bold mt-1">
                  ₹{totalRevenue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Products Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Package2 className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="default"
                  className="bg-blue-100 text-blue-700 border-blue-200"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {productsGrowth}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </p>
                <p className="text-xs text-gray-500 mt-2">Active listings</p>
              </div>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {salesGrowth}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Sales
                </p>
                <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
                <p className="text-xs text-gray-500 mt-2">Completed orders</p>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="default"
                  className="bg-purple-100 text-purple-700 border-purple-200"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {revenueGrowth}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Total earnings</p>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="default"
                  className="bg-orange-100 text-orange-700 border-orange-200"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {ordersGrowth}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.length - deliveredOrders.length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Needs attention</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section - Sales Overview with Modern Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Sales Analytics</CardTitle>
                  <CardDescription>
                    Monthly revenue breakdown and trends
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Modern Vertical Bar Chart */}
              <div className="space-y-6">
                {/* Chart Area */}
                <div className="flex items-end justify-between gap-3 h-64 pb-8 border-b border-gray-200">
                  {[
                    {
                      month: "Jan",
                      value:
                        deliveredOrders.length > 0
                          ? deliveredOrders.length * 1200
                          : 5400,
                    },
                    {
                      month: "Feb",
                      value:
                        deliveredOrders.length > 0
                          ? deliveredOrders.length * 1400
                          : 6800,
                    },
                    {
                      month: "Mar",
                      value: totalRevenue > 0 ? totalRevenue * 0.3 : 8200,
                    },
                    {
                      month: "Apr",
                      value: totalRevenue > 0 ? totalRevenue * 0.25 : 7100,
                    },
                    {
                      month: "May",
                      value:
                        deliveredOrders.length > 0
                          ? deliveredOrders.length * 1600
                          : 9500,
                    },
                    {
                      month: "Jun",
                      value: totalRevenue > 0 ? totalRevenue * 0.4 : 11200,
                    },
                    {
                      month: "Jul",
                      value: totalRevenue > 0 ? totalRevenue * 0.5 : 10800,
                    },
                    {
                      month: "Aug",
                      value:
                        deliveredOrders.length > 0
                          ? deliveredOrders.length * 1800
                          : 12400,
                    },
                    {
                      month: "Sep",
                      value: totalRevenue > 0 ? totalRevenue * 0.6 : 13600,
                    },
                    {
                      month: "Oct",
                      value: totalRevenue > 0 ? totalRevenue * 0.7 : 14200,
                    },
                    {
                      month: "Nov",
                      value: totalRevenue > 0 ? totalRevenue * 0.85 : 15800,
                    },
                    { month: "Dec", value: totalRevenue || 16500 },
                  ].map((item, index) => {
                    const maxValue = 20000;
                    const heightPercent = (item.value / maxValue) * 100;
                    const isCurrentMonth = index === 11; // December (current)

                    return (
                      <div
                        key={item.month}
                        className="flex-1 flex flex-col items-center gap-2 group"
                      >
                        {/* Value Label on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          ₹{item.value.toFixed(0)}
                        </div>

                        {/* Bar */}
                        <div
                          className="w-full flex items-end justify-center"
                          style={{ height: "200px" }}
                        >
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative ${
                              isCurrentMonth
                                ? "bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 shadow-lg shadow-blue-500/50"
                                : "bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          >
                            {/* Animated shimmer effect for current month */}
                            {isCurrentMonth && (
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse rounded-t-lg"></div>
                            )}
                          </div>
                        </div>

                        {/* Month Label */}
                        <span
                          className={`text-xs font-medium ${
                            isCurrentMonth
                              ? "text-blue-600 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend and Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-xs text-gray-600">Current Month</p>
                      <p className="text-sm font-bold text-gray-900">
                        ₹{totalRevenue.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Growth</p>
                      <p className="text-sm font-bold text-green-600">+23.5%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Avg Order</p>
                      <p className="text-sm font-bold text-gray-900">
                        ₹
                        {orders.length > 0
                          ? (totalRevenue / orders.length).toFixed(0)
                          : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Total Orders</p>
                      <p className="text-sm font-bold text-gray-900">
                        {orders.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Top Products</CardTitle>
              <CardDescription>Best performing items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sellerProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500">₹{product.price}</p>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                ))}
                {sellerProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No products yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Recent Sales</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSalesList
                orders={orders}
                orderProducts={orderProducts}
                loading={loading}
                maxItems={5}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Low Stock Alert
              </CardTitle>
              <CardDescription>
                Products running low on inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sellerProducts
                  .filter((product) => product.outofstock)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Package className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{product.price}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outOfStock"
                        className="bg-red-100 text-red-700 border-red-200"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  ))}
                {sellerProducts.filter((p) => p.outofstock).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-green-300" />
                    <p className="text-sm font-medium">
                      All products in stock!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Ready to grow your business?
                </h3>
                <p className="text-blue-100">
                  Add new products, manage inventory, or view detailed analytics
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => setShowProductForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const isVerifiedSeller = user?.seller_status === "active";
  const emailConfirmed = !!user?.email_confirmed_at; // Supabase user metadata may include this
  const [hasVerificationDocs, setHasVerificationDocs] =
    useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  // Load verification docs presence for current seller (existing sellers must reverify if missing)
  useEffect(() => {
    const loadDocs = async () => {
      if (!sellerId) {
        setHasVerificationDocs(false);
        setVerificationStatus(null);
        return;
      }
      try {
        const { data } = await supabase
          .from("seller_verification_request")
          .select(
            "status, government_id_url, business_license_no, business_full_address, submitted_at"
          )
          .eq("seller_id", sellerId)
          .order("submitted_at", { ascending: false })
          .limit(1);
        const ver = data && data[0];
        setVerificationStatus(ver?.status || null);
        const ok = !!(
          ver &&
          (ver.business_license_no || "").trim() &&
          (ver.government_id_url || "").trim() &&
          (ver.business_full_address || "").trim()
        );
        setHasVerificationDocs(ok);
      } catch {
        setHasVerificationDocs(false);
        setVerificationStatus(null);
      }
    };
    loadDocs();
  }, [sellerId]);

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          My Products
        </h3>
        {verificationStatus === "approved" ? (
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        ) : (
          <div className="flex flex-col items-end">
            <Button
              disabled
              variant="outline"
              className="opacity-60 cursor-not-allowed"
            >
              Add Product
            </Button>
            <p className="text-xs text-red-600 mt-1 max-w-[260px] text-right">
              {verificationStatus === "pending"
                ? "Verification pending admin approval."
                : verificationStatus === "rejected"
                ? "Verification rejected. Please resubmit your form."
                : "Submit seller verification form to start listing products."}
            </p>
          </div>
        )}
      </div>

      {verificationStatus === "approved" &&
        (showProductForm || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setShowProductForm(false);
              setEditingProduct(undefined);
            }}
            onSuccess={() => {
              setShowProductForm(false);
              setEditingProduct(undefined);
              loadProducts(sellerId); // Refresh products list for this seller
            }}
          />
        )}
      {verificationStatus === "approved" ? (
        <ProductList
          products={sellerProducts as any}
          showSellerColumn={false}
          onEdit={(product: any) => {
            // Normalize variant for ProductForm (expects object)
            let parsedVariant: any = {};
            try {
              parsedVariant =
                typeof product?.variant === "string" && product?.variant
                  ? JSON.parse(product.variant)
                  : product?.variant || {};
            } catch {
              parsedVariant = {};
            }
            setEditingProduct({ ...product, variant: parsedVariant });
          }}
          onView={(product) => console.log("View product:", product)}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {!emailConfirmed
                ? "Email verification pending. Please check your inbox to verify your account."
                : !isVerifiedSeller
                ? "Seller verification required. Complete the form to start listing products."
                : "Verification documents required (License No, PAN/Tax ID, Govt ID). Complete the form to proceed."}
            </p>
            <div className="flex justify-center gap-3">
              {verificationStatus !== "approved" && (
                <Button
                  onClick={() => navigate("/seller/vform")}
                  className="text-xs bg-blue-600 hover:bg-blue-700"
                >
                  Complete Verification
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground">
        My Sales Analytics
      </h3>
      <AnalyticsCharts
        userRole="seller"
        orders={deliveredOrders}
        orderProducts={orderProducts}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <SalesTable
            orders={orders}
            orderProducts={orderProducts}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          Profile Settings
        </h3>
        {verificationStatus === "approved" ? (
          <Badge variant="default">Verified</Badge>
        ) : (
          <button
            onClick={() => navigate("/seller/vform")}
            className="border rounded-lg p-2 px-3 bg-blue-500 text-white hover:bg-blue-600"
          >
            Seller-Verification-Form
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                defaultValue={user?.phone}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="border float-right rounded-md bg-blue-500 hover:bg-blue-600"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Business details (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter business name"
                defaultValue={user?.business_name}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Business features will be available soon
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category</Label>
              <Input
                id="businessCategory"
                placeholder="Enter business category"
                defaultValue={user?.business_category}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                placeholder="Enter business address"
                rows={3}
                defaultValue={user?.business_address}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                placeholder="Enter tax ID"
                defaultValue={user?.tax_id}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <Button
                className="border float-right rounded-md bg-gray-400 cursor-not-allowed"
                disabled
              >
                Business Features Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (activeTab) {
    case "dashboard":
      return renderDashboard();
    case "products":
      return renderProducts();
    case "sales":
      return renderSales();
    case "profile":
      return renderProfile();
    default:
      return renderDashboard();
  }
}
