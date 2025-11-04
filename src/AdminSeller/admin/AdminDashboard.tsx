import { Children, useEffect, useState } from "react";
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
import supabase from "../../supabase";
import ProductList from "./components/Products/ProductList";
import useAdminProducts from "./hooks/useAdminProducts";
import { mockProducts, mockSellers, statsCards } from "./mockData";
import BrandsList from "./components/Products/BrandsList";
import CategoryList from "./components/Products/CategoryList";
import SalesOverallList from "./components/Sales/SalesOverallList";

// Types
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sellerId: string;
  stock: number;
};

// Placeholder hooks - in Next.js these would be imported from contexts
const useProducts = () => ({
  products: [] as Product[],
});

const useAuth = () => ({
  getSellerRequests: () =>
    [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice@business.com",
        businessName: "Alice Electronics",
        businessType: "Electronics Retailer",
        phone: "+1-234-567-8901",
        status: "pending",
        description:
          "I want to sell high-quality electronics and gadgets on your platform.",
        requestDate: "2 days ago",
      },
      {
        id: "2",
        name: "Bob Wilson",
        email: "bob@crafts.com",
        businessName: "Bob's Handmade Crafts",
        businessType: "Handicrafts",
        phone: "+1-234-567-8902",
        status: "pending",
        description:
          "Specializing in handmade wooden furniture and decorative items.",
        requestDate: "1 day ago",
      },
    ] as any[],
  approveSellerRequest: (id: string) => console.log("Approved:", id),
  rejectSellerRequest: (id: string) => console.log("Rejected:", id),
});

const useToast = () => ({
  toast: (msg: { title: string; description?: string; variant?: string }) =>
    console.log("Toast:", msg),
});

// Placeholder components - in Next.js these would be imported from separate files
const SalesAnalytics = ({ userRole }: { userRole?: string }) => (
  <SalesOverallList/>
  // <Card>
  //   <CardHeader>
  //     <CardTitle>Revenue Analytics</CardTitle>
  //     <CardDescription>Sales performance overview</CardDescription>
  //   </CardHeader>
  //   <CardContent>
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //       <div className="space-y-2">
  //         <p className="text-sm font-medium">Monthly Revenue</p>
  //         <p className="text-2xl font-bold">$12,450</p>
  //         <p className="text-xs text-green-600">+23% from last month</p>
  //       </div>
  //       <div className="space-y-2">
  //         <p className="text-sm font-medium">Total Orders</p>
  //         <p className="text-2xl font-bold">156</p>
  //         <p className="text-xs text-green-600">+8% from last month</p>
  //       </div>
  //       <div className="space-y-2">
  //         <p className="text-sm font-medium">Active Sellers</p>
  //         <p className="text-2xl font-bold">24</p>
  //         <p className="text-xs text-green-600">+12% from last month</p>
  //       </div>
  //     </div>
  //   </CardContent>
  // </Card>
);

// ProductList and mock data moved to separate files for readability

const ProductForm = ({
  product,
  onClose,
  onSuccess,
}: {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      <CardDescription>
        {product
          ? "Update product information"
          : "Create a new product listing"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Product form would go here...
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSuccess}>
            {product ? "Update" : "Create"} Product
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// mock data (products, sellers, stats) moved to ./mockData

interface AdminDashboardProps {
  activeTab: string;
  activeSub?: string | null;
}

export default function AdminDashboard({
  activeTab,
  activeSub,
}: AdminDashboardProps) {
  const {
    products: adminProducts,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useAdminProducts();
  const [sellerOptions, setSellerOptions] = useState<
    { seller_id: string; company_name: string }[]
  >([]);
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<
    string | null
  >(null);
  const { getSellerRequests, approveSellerRequest, rejectSellerRequest } =
    useAuth();
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const allCategories = Array.from(
    new Set(mockProducts.map((p: any) => p.category).filter(Boolean))
  );
  const allBrands = Array.from(
    new Set(
      mockProducts
        .map((p: any) => (p as any).seller || (p as any).brand)
        .filter(Boolean)
    )
  );

  // Load sellers for dropdown once
  useEffect(() => {
    const loadSellers = async () => {
      try {
        const { data, error } = await supabase
          .from("sellers")
          .select("seller_id, company_name")
          .order("company_name", { ascending: true });
        if (!error && data) setSellerOptions(data as any);
      } catch {}
    };
    loadSellers();
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Recent Activity */}
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
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Name
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Products
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Sales
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockSellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-border">
                    <td className="p-4 text-card-foreground">{seller.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {seller.email}
                    </td>
                    <td className="p-4 text-card-foreground">
                      {seller.products}
                    </td>
                    <td className="p-4 text-card-foreground">
                      ${seller.sales}
                    </td>
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
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          All Products
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
          }}
        />
      )}

      {productsError && (
        <div className="text-sm text-red-600">{productsError}</div>
      )}
      <ProductList
        productsParam={adminProducts as any}
        showSellerColumn={true}
        onEdit={(product) => setEditingProduct(product)}
        onView={(product) => console.log("View product:", product)}
      />
    </div>
  );

  const renderSellerProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Seller Products
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Seller:</label>
          <select
            value={selectedSellerFilter ?? ""}
            onChange={(e) => {
              const val = e.target.value || null;
              setSelectedSellerFilter(val);
              fetchProducts(val || undefined);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Sellers</option>
            {sellerOptions.map((s) => (
              <option key={s.seller_id} value={s.seller_id}>
                {s.company_name || s.seller_id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {productsError && (
        <div className="text-sm text-red-600">{productsError}</div>
      )}
      <ProductList
        productsParam={adminProducts as any}
        showSellerColumn={true}
        onEdit={(p) => setEditingProduct(p)}
        onView={(p) => console.log(p)}
      />
    </div>
  );

  const renderCategories = () => (
    <CategoryList />
  );

  const renderBrands = () => (
    <BrandsList />

  );

  const renderSales = () => (
    // <div className="space-y-6">
    //   <h3 className="text-lg font-semibold text-card-foreground">
    //     Sales Analytics
    //   </h3>
    //   <SalesAnalytics userRole="admin" />
    // </div>
    <SalesOverallList/>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground">
        System Settings
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure system preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Email Notifications</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Payment Settings</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Security Settings</span>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Version</span>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Last Updated</span>
              <span className="text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">System Status</span>
              <Badge variant="default">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSellerRequests = () => {
    const pendingRequests = getSellerRequests();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-card-foreground">
            Pending Seller Requests
          </h3>
          <Badge variant="pending">{pendingRequests.length} pending</Badge>
        </div>

        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No pending seller requests
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                      <CardDescription>{request.email}</CardDescription>
                    </div>
                    <Badge variant="pending">
                      <Clock className="h-3 w-3 mr-1" />
                      {request.requestDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Business Name
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.businessName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Business Type
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.businessType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Phone
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Status
                      </p>
                      <Badge variant="pending">{request.status}</Badge>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-card-foreground mb-2">
                      Description
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

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

  // If the Products parent is active but a child is selected, render the child's view
  if (activeTab === "products" && activeSub) {
    switch (activeSub) {
      case "seller-products":
        return renderSellerProducts();
      case "categories":
        return renderCategories();
      case "brands":
        return renderBrands();
      case "all-products":
        case "all-orders":
          return renderSales();
      default:
        return renderProducts();
    }
  }

  switch (activeTab) {
    case "dashboard":
      return renderDashboard();
    case "sellers":
      return renderSellers();
    case "seller-requests":
      return renderSellerRequests();
    case "products":
      return renderProducts();
    case "seller-products":
      return renderSellerProducts();
    case "categories":
      return renderCategories();
    case "brands":
      return renderBrands();
    case "analytics":
      return renderSales();
    case "settings":
      return renderSettings();
    default:
      return renderDashboard();
  }
}
