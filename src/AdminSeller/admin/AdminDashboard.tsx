import { Children, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus } from "lucide-react";
import supabase from "../../supabase";
import ProductList from "./components/Products/ProductList";
import Pagination from "./components/Pagination";
import useAdminProducts from "./hooks/useAdminProducts";
import { mockProducts, mockSellers, statsCards } from "./mockData";
import BrandsList from "./components/Products/BrandsList";
import CategoryList from "./components/Products/CategoryList";
import SalesOverallList from "./components/Sales/SalesOverallList";
import SalesBySeller from "./components/Sales/SalesBySeller";
import UnpaidOrders from "./components/Sales/paidUnPaidOrders";
import AdminSidebar from "./components/AdminSidebar";
import { getAdminNavItems } from "./navConfig";
import AllSellers from "./components/Sellers/AllSellers";
import FlashDeals from "./components/Marketing/FlashDeals";

import PendingRequestSeller from "./components/Sellers/PendingRequestSeller";
import DynamicPopUp from "./components/Marketing/DynamicPopUp";
import Coupons from "./components/Marketing/Coupons";
import TotalEarnings from "./components/Reports/TotalEarnings";
import ReportsBySeller from "./components/Reports/ReportsBySeller";
import ProductStock from "./components/Reports/ProductStock";
import CommissionHistory from "./components/Reports/CommissionHistory";
import UserSearches from "./components/Reports/UserSearches";
import WalletRechargeHistory from "./components/Reports/WalletRechargeHistory";
import AdminSetting from "./components/Settings/AdminSetting";
import TotalEarningMapping from "./components/Reports/TotalEarningMapping";
import MegaDeals from "./components/Marketing/MegaDeals";
import NewsLetter from "./components/Marketing/NewsLetter";

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
  <SalesOverallList />
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
  activeTab?: string;
  activeSub?: string | null;
  onNavigate?: (tab: string, sub?: string | null) => void;
  withSidebar?: boolean; // If false, renders content only (use when parent already has a sidebar)
}

export default function AdminDashboard({
  activeTab: propActiveTab,
  activeSub: propActiveSub,
  onNavigate,
  withSidebar = true,
}: AdminDashboardProps) {
  const {
    products: adminProducts,
    loading: productsLoading,
    error: productsError,
    totalCount: productsTotalCount,
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
  const [productsPage, setProductsPage] = useState<number>(1);
  const [sellerProductsPage, setSellerProductsPage] = useState<number>(1);
  const [filter, setFilter] = useState("Select");
  const PAGE_SIZE = 10;

  // Local fallback state if parent doesn't control routing
  const [internalTab, setInternalTab] = useState<string>(
    propActiveTab ?? "dashboard"
  );
  const [internalSub, setInternalSub] = useState<string | null>(
    propActiveSub ?? null
  );

  useEffect(() => {
    if (propActiveTab) setInternalTab(propActiveTab);
  }, [propActiveTab]);
  useEffect(() => {
    if (propActiveSub !== undefined) setInternalSub(propActiveSub ?? null);
  }, [propActiveSub]);

  const activeTab = propActiveTab ?? internalTab;
  const activeSub = propActiveSub ?? internalSub;

  const handleNavigate = (tab: string, sub?: string | null) => {
    if (onNavigate) {
      onNavigate(tab, sub);
    } else {
      setInternalTab(tab);
      setInternalSub(sub ?? null);
    }
  };

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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg bg-white text-black hover:bg-white"
        >
          {" "}
          <option>Select</option>
          <option>New Sellers</option>
          <option>Highest Sellers</option>
          <option>Lowest Sellers</option>
          <option>Active Sellers</option>
          <option>Inactive Sellers</option>
        </select>
      </div>

      <AllSellers />
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

      <Pagination
        currentPage={productsPage}
        pageSize={PAGE_SIZE}
        totalCount={productsTotalCount}
        label="products"
        onPageChange={(p) => {
          const page = Math.max(1, p);
          setProductsPage(page);
          fetchProducts(undefined, page, PAGE_SIZE);
        }}
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
              setSellerProductsPage(1);
              fetchProducts(val || undefined, 1, PAGE_SIZE);
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

      <Pagination
        currentPage={sellerProductsPage}
        pageSize={PAGE_SIZE}
        totalCount={productsTotalCount}
        label="products"
        onPageChange={(p) => {
          const page = Math.max(1, p);
          setSellerProductsPage(page);
          fetchProducts(selectedSellerFilter || undefined, page, PAGE_SIZE);
        }}
      />
    </div>
  );

  const renderCategories = () => <CategoryList />;

  const renderBrands = () => <BrandsList />;

  const renderSales = () => <SalesOverallList />;

  const renderMarketing = () => <FlashDeals />;
  const renderMegaDeals = () => <MegaDeals />;
  const renderFlashDeals = () => <FlashDeals />;
  const renderNewsLetter = () => <NewsLetter />;
  const renderDynamicPopup = () => <DynamicPopUp />;
  const renderCoupons = () => <Coupons />;

  // Reports renderers
  const renderTotalEarnings = () => <TotalEarningMapping />;
  const renderReportsBySeller = () => <ReportsBySeller />;
  const renderProductStock = () => <ProductStock />;
  const renderCommissionHistory = () => <CommissionHistory />;
  const renderUserSearches = () => <UserSearches />;
  const renderWalletRechargeHistory = () => <WalletRechargeHistory />;

  const renderSettings = () => <AdminSetting />;

  const renderSellerRequests = () => (
    <div className="space-y-6">
      <PendingRequestSeller />
    </div>
  );

  const content = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "sellers":
        // Sub-routing inside sellers parent
        switch (activeSub) {
          case "seller-requests":
            return renderSellerRequests();
          case "all-sellers":
          default:
            return renderSellers();
        }
      case "products":
        // If a sub-tab under products is active, render that view
        switch (activeSub) {
          case "seller-products":
            return renderSellerProducts();
          case "categories":
            return renderCategories();
          case "brands":
            return renderBrands();
          case "all-products":
          default:
            return renderProducts();
        }
      case "seller-products":
        return renderSellerProducts();
      case "categories":
        return renderCategories();
      case "brands":
        return renderBrands();
      case "sales":
        // Sales sub-routes
        switch (activeSub) {
          case "overall-orders":
            return <SalesOverallList />;
          case "sales-by-seller":
            return <SalesBySeller />;
          case "unpaid-orders":
            return <UnpaidOrders />;
          default:
            return renderSales();
        }
      case "settings":
        return renderSettings();
      case "marketing":
        // marketing parent; route by sub if present
        switch (activeSub) {
          case "mega-deals":
            return renderMegaDeals();
          case "flash-deals":
            return renderFlashDeals();
          case "dynamic-popup":
            return renderDynamicPopup();
          case "news-letter":
            return renderNewsLetter();
          case "coupons":
            return renderCoupons();
          default:
            return renderMarketing();
        }
      case "reports":
        switch (activeSub) {
          case "total-earnings":
            return renderTotalEarnings();
          case "reports-by-seller":
            return renderReportsBySeller();
          case "product-stock":
            return renderProductStock();
          case "commission-history":
            return renderCommissionHistory();
          case "user-searches":
            return renderUserSearches();
          case "wallet-recharge-history":
            return renderWalletRechargeHistory();
          default:
            return renderTotalEarnings();
        }
      default:
        return renderDashboard();
    }
  }, [
    activeTab,
    activeSub,
    productsError,
    adminProducts,
    productsPage,
    sellerProductsPage,
    productsTotalCount,
    selectedSellerFilter,
  ]);

  if (!withSidebar) {
    // Render just the main content area; parent layout should provide its own sidebar
    return (
      <div className="min-h-screen bg-background p-4  ">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        activeSub={activeSub}
        items={getAdminNavItems().map((n) => ({
          key: n.id,
          label: n.label,
          children: n.children?.map((c) => ({ key: c.id, label: c.label })),
          // Optional: show pending badge if this view is used standalone
          badge: n.id === "sellers" ? getSellerRequests().length : undefined,
        }))}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{content}</main>
    </div>
  );
}
