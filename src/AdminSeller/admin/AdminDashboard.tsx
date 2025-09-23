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
} from "lucide-react";

// Product type
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  seller?: string;
};

// Stub hooks
const useProducts = () => ({ products: [] as Product[] });
const useAuth = () => ({
  getSellerRequests: () => [] as any[],
  approveSellerRequest: (id: string | number) => {},
  rejectSellerRequest: (id: string | number) => {},
});
const useToast = () => ({
  toast: (msg: { title: string; description?: string; variant?: string }) =>
    console.log(msg),
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600">
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sellers</CardTitle>
            <CardDescription>Latest seller registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSellers.slice(0, 3).map((seller) => (
                <div
                  key={seller.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {seller.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {seller.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      seller.status === "active" ? "default" : "inactive"
                    }
                  >
                    {seller.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${product.price}
                    </p>
                  </div>
                  <Badge variant={product.stock > 0 ? "default" : "outOfStock"}>
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSellers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          All Sellers
        </h3>
        <Button>Add New Seller</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Products</th>
                  <th className="text-left p-4">Sales</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-border">
                    <td className="p-4">{seller.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {seller.email}
                    </td>
                    <td className="p-4">{seller.products}</td>
                    <td className="p-4">${seller.sales}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          seller.status === "active" ? "default" : "inactive"
                        }
                      >
                        {seller.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
    </div>
  );

  switch (activeTab) {
    case "dashboard":
      return renderDashboard();
    case "sellers":
      return renderSellers();
    case "products":
      return <p>Products tab (same design can be added)</p>;
    case "analytics":
      return <p>Analytics tab (same design can be added)</p>;
    case "settings":
      return <p>Settings tab (same design can be added)</p>;
    case "seller-requests":
      return <p>Seller requests tab (same design can be added)</p>;
    default:
      return renderDashboard();
  }
}
