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

import supabase from "../../supabase";

// Product type
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sellerId: string;
  stock: number;
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

// Sample products for testing
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    category: "Electronics",
    description: "High-quality wireless headphones",
    sellerId: "seller123",
    stock: 15,
  },
  {
    id: "2",
    name: "Smartphone Case",
    price: 24.99,
    category: "Accessories",
    description: "Protective smartphone case",
    sellerId: "seller123",
    stock: 5,
  },
  {
    id: "3",
    name: "USB-C Cable",
    price: 12.99,
    category: "Electronics",
    description: "Fast charging USB-C cable",
    sellerId: "seller123",
    stock: 0,
  },
];

// Products hook (with sample data for now)
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const getProductsBySeller = (sellerId: string) => {
    return products.filter((product) => product.sellerId === sellerId);
  };

  return { products, getProductsBySeller };
};

const ProductList = ({
  products,
  showSellerColumn,
  onEdit,
  onView,
}: {
  products: Product[];
  showSellerColumn?: boolean;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
}) => (
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
                Price
              </th>
              <th className="text-left p-4 font-medium text-card-foreground">
                Category
              </th>
              <th className="text-left p-4 font-medium text-card-foreground">
                Stock
              </th>
              <th className="text-left p-4 font-medium text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No products found. Add your first product to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-border">
                  <td className="p-4 text-card-foreground">{product.name}</td>
                  <td className="p-4 text-card-foreground">${product.price}</td>
                  <td className="p-4 text-card-foreground">
                    {product.category}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        product.stock === 0
                          ? "outOfStock"
                          : product.stock <= 10
                          ? "pending"
                          : "default"
                      }
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} in stock`}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(product)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(product)}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

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
          : "Fill in the details for your new product"}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="Enter product name"
            defaultValue={product?.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productPrice">Price</Label>
          <Input
            id="productPrice"
            type="number"
            placeholder="0.00"
            defaultValue={product?.price}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productCategory">Category</Label>
          <Input
            id="productCategory"
            placeholder="Enter category"
            defaultValue={product?.category}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productStock">Stock Quantity</Label>
          <Input
            id="productStock"
            type="number"
            placeholder="0"
            defaultValue={product?.stock}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="productDescription">Description</Label>
        <Textarea
          id="productDescription"
          placeholder="Enter product description"
          rows={3}
          defaultValue={product?.description}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSuccess}>
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

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

// Mock data for seller dashboard
const mockSalesData = [
  {
    id: 1,
    product: "Wireless Headphones",
    quantity: 2,
    amount: 199.98,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    product: "Bluetooth Speaker",
    quantity: 1,
    amount: 79.99,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    product: "Phone Case",
    quantity: 3,
    amount: 74.97,
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    product: "Charging Cable",
    quantity: 1,
    amount: 19.99,
    date: "2024-01-12",
    status: "completed",
  },
];

interface SellerDashboardProps {
  activeTab: string;
}

export default function SellerDashboard({ activeTab }: SellerDashboardProps) {
  const { user } = useAuth();
  const { products, getProductsBySeller } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const sellerProducts = getProductsBySeller(user?.id || "");
  const totalProducts = sellerProducts.length;
  const totalSales = mockSalesData.length;
  const totalRevenue = mockSalesData
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.amount, 0);

  const handleAddProduct = () => {
    console.log("Adding product:", editingProduct);
    setShowProductForm(false);
    setEditingProduct(undefined);
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
                  {mockSalesData.length}
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
                  ${totalRevenue.toFixed(2)}
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
                    <p className="text-sm text-muted-foreground">{sale.date}</p>
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
                .filter((product) => product.stock <= 10)
                .map((product) => (
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
                    <Badge
                      variant={product.stock === 0 ? "outOfStock" : "default"}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} left`}
                    </Badge>
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
          }}
        />
      )}

      <ProductList
        products={sellerProducts}
        showSellerColumn={false}
        onEdit={(product) => setEditingProduct(product)}
        onView={(product) => console.log("View product:", product)}
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
