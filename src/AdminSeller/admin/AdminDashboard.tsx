import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
// import { AnalyticsCharts } from "./components/analytics-charts";
// import { ProductList } from "./components/product-list";
// import { ProductForm } from "./components/product-form";

// Import your contexts/hooks (implement if missing)
// import { useProducts, type Product } from "./contexts/product-context";
// import { useAuth } from "./contexts/auth-context";
// import { useToast } from "./hooks/use-toast";

// Temporary type definitions
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
};

// Simple hooks placeholders
const useProducts = () => ({
  products: [] as Product[],
  addProduct: (product: Product) => {},
  updateProduct: (id: number, product: Partial<Product>) => {},
  deleteProduct: (id: number) => {},
});

const useAuth = () => ({
  user: { name: "Admin", role: "admin" },
  isAuthenticated: true,
  getSellerRequests: () => [],
  approveSellerRequest: (id: string | number) => {},
  rejectSellerRequest: (id: string | number) => {},
});

const useToast = () => ({
  toast: (message: { title: string; description?: string; variant?: string }) =>
    console.log(message),
});

// Mock data
const mockSellers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    products: 12,
    sales: 2450,
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    products: 8,
    sales: 1890,
    status: "active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    products: 15,
    sales: 3200,
    status: "inactive",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    products: 6,
    sales: 1200,
    status: "active",
  },
];

const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    seller: "John Smith",
    price: 99.99,
    stock: 45,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Coffee Mug",
    seller: "Sarah Johnson",
    price: 15.99,
    stock: 120,
    category: "Home & Garden",
  },
  {
    id: 3,
    name: "Laptop Stand",
    seller: "Mike Wilson",
    price: 49.99,
    stock: 0,
    category: "Electronics",
  },
  {
    id: 4,
    name: "Yoga Mat",
    seller: "Emma Davis",
    price: 29.99,
    stock: 78,
    category: "Sports",
  },
];

const statsCards = [
  {
    title: "Total Sellers",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Products",
    value: "156",
    change: "+8%",
    icon: Package,
    color: "text-green-600",
  },
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+23%",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
];

interface AdminDashboardProps {
  activeTab: string;
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { products } = useProducts();
  const { getSellerRequests, approveSellerRequest, rejectSellerRequest } =
    useAuth();
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  // ---- same render functions from your code ----
  // renderDashboard, renderSellers, renderProducts, renderAnalytics, renderSettings, renderSellerRequests
  // and handlers (handleApproveRequest, handleRejectRequest)
  // (copy from your original code, only imports/paths changed)

  const handleApproveRequest = (requestId: string) => {
    approveSellerRequest(requestId);
    toast({
      title: "Request Approved",
      description: "Seller request has been approved successfully.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    rejectSellerRequest(requestId);
    toast({
      title: "Request Rejected",
      description: "Seller request has been rejected.",
      variant: "destructive",
    });
  };

  // Render functions
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSellers = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sellers Management</h2>
      <div className="grid gap-4">
        {mockSellers.map((seller) => (
          <Card key={seller.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{seller.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {seller.email}
                  </p>
                  <p className="text-sm">
                    Products: {seller.products} | Sales: ${seller.sales}
                  </p>
                </div>
                <Badge
                  variant={seller.status === "active" ? "default" : "secondary"}
                >
                  {seller.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSellerRequests = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Seller Requests</h2>
      <p className="text-muted-foreground">
        No pending seller requests at the moment.
      </p>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      <p className="text-muted-foreground">
        Product management interface would go here.
      </p>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p className="text-muted-foreground">
        Analytics charts and data would go here.
      </p>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-muted-foreground">
        System settings and configuration options would go here.
      </p>
    </div>
  );

  switch (activeTab) {
    case "dashboard":
      return renderDashboard();
    case "sellers":
      return renderSellers();
    case "seller-requests":
      return renderSellerRequests();
    case "products":
      return renderProducts();
    case "analytics":
      return renderAnalytics();
    case "settings":
      return renderSettings();
    default:
      return renderDashboard();
  }
}
