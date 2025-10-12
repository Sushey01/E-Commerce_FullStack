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

// Order type for orders functionality
type Order = {
  id: string;
  product_id?: string;
  product?: string;
  quantity?: number;
  amount?: number;
  total?: number;
  date?: string;
  created_at?: string;
  status: string;
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

const AnalyticsCharts = ({ userRole }: { userRole?: string }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>Your sales performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
          <p className="text-muted-foreground">Sales Chart Placeholder</p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Your best selling products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Wireless Headphones</span>
            <span className="text-sm text-muted-foreground">24 sold</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Smartphone Case</span>
            <span className="text-sm text-muted-foreground">18 sold</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">USB-C Cable</span>
            <span className="text-sm text-muted-foreground">15 sold</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Mock data for seller dashboard - realistic recent sales
const mockSalesData = [
  {
    id: 1,
    product: "Wireless Bluetooth Headphones",
    quantity: 1,
    amount: 89.99,
    date: "2025-10-12",
    status: "completed",
  },
  {
    id: 2,
    product: "Gaming Mechanical Keyboard",
    quantity: 1,
    amount: 149.99,
    date: "2025-10-11",
    status: "completed",
  },
  {
    id: 3,
    product: "4K Webcam HD",
    quantity: 2,
    amount: 159.98,
    date: "2025-10-10",
    status: "pending",
  },
  {
    id: 4,
    product: "USB-C Fast Charging Cable",
    quantity: 3,
    amount: 29.97,
    date: "2025-10-09",
    status: "completed",
  },
  {
    id: 5,
    product: "Wireless Mouse RGB",
    quantity: 1,
    amount: 45.99,
    date: "2025-10-08",
    status: "completed",
  },
];

interface SellerDashboardProps {
  activeTab: string;
}

export default function SellerDashboard({ activeTab }: SellerDashboardProps) {
  const { user } = useAuth();
  const { products, getProductsBySeller, loadProducts } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderProducts, setOrderProducts] = useState<{[key: string]: Product}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliveredOrders = async () => {
      setLoading(true);
      
      // First, fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "Delivered");

      if (ordersError) {
        console.error("Error loading orders:", ordersError);
        setLoading(false);
        return;
      }

      // Then, fetch all products to map with orders
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) {
        console.error("Error loading products:", productsError);
      }

      // Create a map of product_id to product for easy lookup
      const productMap: {[key: string]: Product} = {};
      if (productsData) {
        productsData.forEach((product: Product) => {
          productMap[product.id] = product;
        });
      }

      setOrders(ordersData || []);
      setOrderProducts(productMap);
      setLoading(false);
    };

    loadDeliveredOrders();
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const sellerProducts = getProductsBySeller(user?.id || "");
  const totalProducts = sellerProducts.length;

  // ✅ Real data from Supabase
  const totalSales = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

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
                <p className="text-xs text-green-600">+2 this month</p>
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
                <p className="text-xs text-green-600">+15% from last month</p>
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
                <p className="text-xs text-green-600">+23% from last month</p>
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
            <div className="space-y-4">
              {mockSalesData.slice(0, 3).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {sale.product}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">
                      ${sale.amount}
                    </p>
                    <Badge
                      variant={
                        sale.status === "completed" ? "completed" : "pending"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
      <AnalyticsCharts userRole="seller" />

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
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
                {mockSalesData.map((sale) => (
                  <tr key={sale.id} className="border-b border-border">
                    <td className="p-4 text-card-foreground">{sale.product}</td>
                    <td className="p-4 text-card-foreground">
                      {sale.quantity}
                    </td>
                    <td className="p-4 text-card-foreground">${sale.amount}</td>
                    <td className="p-4 text-muted-foreground">{sale.date}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          sale.status === "completed" ? "completed" : "pending"
                        }
                      >
                        {sale.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Manage your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" placeholder="Enter business name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                placeholder="Enter business address"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" placeholder="Enter tax ID" />
            </div>
            <Button>Update Business Info</Button>
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
