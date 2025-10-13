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

import { Package, DollarSign, TrendingUp, Plus } from "lucide-react";
import ProductForm from "./components/Product-Form";
import ProductList from "./components/ProductList";
import {
  useSalesData,
  RecentSalesList,
  SalesTable,
} from "./components/SalesManager";
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

// Real auth hook using Supabase
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
          id: authUser.id,
          name: profile?.full_name || authUser.email,
          email: authUser.email,
          ...profile,
        });
      }
    };
    getUser();
  }, []);

  return { user };
};

// Sample products - start with empty array, will load from database
const sampleProducts: Product[] = [];

// Products hook with database loading
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Error loading products:", error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const getProductsBySeller = (sellerId: string) => {
    return products; // Return all products for now since we don't have seller relationship
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
  const { products, getProductsBySeller, loadProducts } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  // Use the SalesManager hook for all sales data (no user filtering needed)
  const {
    orders,
    deliveredOrders,
    orderProducts,
    loading,
    totalSales,
    totalRevenue,
  } = useSalesData();

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const sellerProducts = getProductsBySeller(user?.id || "");
  const totalProducts = sellerProducts.length;

  const handleAddProduct = () => {
    console.log("Adding product:", editingProduct);
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) {
          console.error("Error deleting product:", error);
          alert("Failed to delete product. Please try again.");
          return;
        }

        // Reload products after successful deletion
        loadProducts();
        console.log("Product deleted successfully");
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  My Products
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalProducts}
                </p>
                <p className="text-xs text-muted-foreground">Products listed</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalSales}
                </p>
                <p className="text-xs text-muted-foreground">
                  Completed orders
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenue
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  Rs{totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Total earned</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSalesList
              orders={orders}
              orderProducts={orderProducts}
              loading={loading}
              maxItems={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerProducts
                .filter((product) => product.outofstock)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">
                        {product.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price}
                      </p>
                    </div>
                    <Badge variant="outOfStock">Out of stock</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          My Products
        </h3>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {(showProductForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
          }}
          onSuccess={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
            loadProducts(); // Refresh products list
          }}
        />
      )}

      <ProductList
        products={sellerProducts}
        showSellerColumn={false}
        onEdit={(product) => setEditingProduct(product)}
        onView={(product) => console.log("View product:", product)}
        onDelete={handleDeleteProduct}
      />
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
      <h3 className="text-lg font-semibold text-card-foreground">
        Profile Settings
      </h3>

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
