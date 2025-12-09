import { Children, useEffect, useMemo, useState, useRef } from "react";
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
  Plus,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  TrendingDown,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
import RecentOrdersSection from "./components/Dashboard/RecentOrdersSection";
import TopSellersSection from "./components/Dashboard/TopSellersSection";
import StatsHeader from "./components/Dashboard/StatsHeader";
import TopCategoriesSection from "./components/Dashboard/TopCategoriesSection";
import TopBrandsSection from "./components/Dashboard/TopBrandsSection";
import { useAdminDashboardData } from "./hooks/useAdminDashboardData";

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
  user?: {
    name: string;
    role: "admin" | "seller" | "customer";
  } | null;
}

export default function AdminDashboard({
  activeTab: propActiveTab,
  activeSub: propActiveSub,
  onNavigate,
  withSidebar = true,
  user,
}: AdminDashboardProps) {
  const {
    products: adminProducts,
    loading: productsLoading,
    error: productsError,
    totalCount: productsTotalCount,
    fetchProducts,
  } = useAdminProducts();
  const [internalTab, setInternalTab] = useState<string>(
    propActiveTab ?? "dashboard"
  );
  const [internalSub, setInternalSub] = useState<string | null>(
    propActiveSub ?? null
  );
  const activeTab = propActiveTab ?? internalTab;
  // Always fallback to empty string if undefined/null
  const activeSub: string = propActiveSub ?? internalSub ?? "";
  const { dashboardStats, loadingStats } = useAdminDashboardData(activeTab);
  // Render counter and debug logs to trace re-renders and state changes
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  useEffect(() => {
    console.log(`[AdminDashboard] render #${renderCountRef.current}`, {
      activeTab,
      activeSub,
      loadingStats,
      dashboardStatsSummary: dashboardStats
        ? Object.keys(dashboardStats).slice(0, 5)
        : null,
    });
  }, [activeTab, activeSub, loadingStats, dashboardStats]);

  useEffect(() => {
    console.log("[AdminDashboard] mounted");
    return () => console.log("[AdminDashboard] unmounted");
  }, []);
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

  useEffect(() => {
    if (propActiveTab) setInternalTab(propActiveTab);
  }, [propActiveTab]);
  useEffect(() => {
    if (propActiveSub !== undefined) setInternalSub(propActiveSub ?? null);
  }, [propActiveSub]);

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
  // TODO: Move seller dropdown fetch logic to a custom hook if needed. For now, remove supabase logic from here.

  const renderDashboard = () => {
    if (
      loadingStats ||
      !dashboardStats ||
      Object.keys(dashboardStats).length === 0
    ) {
      console.log(
        "Dashboard loadingStats:",
        loadingStats,
        "dashboardStats:",
        dashboardStats
      );
      if (
        !loadingStats &&
        dashboardStats &&
        Object.keys(dashboardStats).length === 0
      ) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-600">
              Dashboard data is empty. Please check your data source.
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6">
        <StatsHeader stats={dashboardStats} user={user} />

        {/* Top Row - Main Stats (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Total Customers */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 mb-1">
                    Total Customers
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {dashboardStats.totalCustomers}
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  Top Customers
                </div>
              </div>
              <div className="flex -space-x-2 mt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Category */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 mb-1">
                    Total Category
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {dashboardStats.totalCategories}
                  </h3>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Computer & Accessories</span>
                  <span className="font-semibold text-gray-900">
                    ${(dashboardStats.totalSales * 0.35).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Cellphones & Tabs</span>
                  <span className="font-semibold text-gray-900">
                    ${(dashboardStats.totalSales * 0.28).toFixed(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Brand */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 mb-1">
                    Total Brand
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {dashboardStats.totalBrands}
                  </h3>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                </div>
              </div>
              <div className="space-y-1">
                {dashboardStats.topBrands.slice(0, 2).map((brand, idx) => (
                  <div
                    key={brand.brand_id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="h-4 w-4 rounded bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-gray-600 truncate">
                      {brand.brand_name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Sellers */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 mb-1">
                    Total Sellers
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {dashboardStats.totalSellers}
                  </h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Active</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {dashboardStats.activeSellers}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-gray-600">Inactive</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {dashboardStats.inactiveSellers}
                  </span>
                </div>
              </div>
              {dashboardStats.pendingSellerRequests > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{dashboardStats.pendingSellerRequests} pending</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Sales Chart & Products Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Sales Chart - 2/3 width */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">
                  Sales this month
                </CardTitle>
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  <span className="font-semibold">
                    ${dashboardStats.salesThisMonth.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simple Line Chart Placeholder */}
              <div className="h-48 md:h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around p-4 gap-1">
                  {[65, 45, 75, 55, 85, 50, 70, 60, 80, 55, 90, 70].map(
                    (height, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:from-blue-600 hover:to-blue-400 relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          $
                          {(
                            (dashboardStats.salesThisMonth / 12) *
                            (height / 70)
                          ).toFixed(0)}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="relative z-10 text-center text-blue-600 opacity-50">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">Monthly Sales Overview</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                  <span>Projected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Stats - 1/3 width */}
          <div className="space-y-4">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">Total Products</p>
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {dashboardStats.totalProducts}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">Seller Products</p>
                  <ShoppingCart className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {dashboardStats.sellerProducts}
                </p>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Listed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Third Row - Orders & Store Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Orders Status */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Total Orders
              </CardTitle>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats.totalOrders}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Order Placed
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.totalOrders}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Confirmed Order
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.confirmedOrders}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Processed Order
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.processedOrders}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Order Shipped
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dashboardStats.pendingOrders}
                </span>
              </div>

              <Button
                onClick={() => handleNavigate("sales")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <div className="space-y-4">
            <Card className="border-none shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    In-house Store
                  </h3>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${(dashboardStats.totalSales * 0.62).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mb-4">Total Sales</p>

                {/* Donut Chart Placeholder */}
                <div className="relative h-32 flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#3B82F6"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${
                        ((dashboardStats.totalSales * 0.62) /
                          dashboardStats.totalSales) *
                        352
                      } 352`}
                      className="transition-all duration-1000"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#EF4444"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${
                        ((dashboardStats.totalSales * 0.38) /
                          dashboardStats.totalSales) *
                        352
                      } 352`}
                      strokeDashoffset={`-${
                        ((dashboardStats.totalSales * 0.62) /
                          dashboardStats.totalSales) *
                        352
                      }`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">62%</p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-md">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Seller Products</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {dashboardStats.sellerProducts}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Average Rating</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {dashboardStats.averageRating}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md col-span-2">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Sellers</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {dashboardStats.totalSellers}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Fourth Row - Top Categories & Brands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Category */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                Top Categories
              </CardTitle>
              <div className="flex gap-2 text-xs mt-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">
                  All Items
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  Week
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  Month
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardStats.topCategories.map((category, idx) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {category.name?.charAt(0) || idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        $
                        {(
                          (dashboardStats.totalSales /
                            dashboardStats.topCategories.length) *
                          (1 - idx * 0.1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Brands */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Top Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardStats.topBrands.map((brand, idx) => (
                  <div
                    key={brand.brand_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {brand.brand_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {brand.brand_name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      $
                      {(
                        (dashboardStats.totalSales /
                          dashboardStats.topBrands.length) *
                        (1 - idx * 0.08)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fifth Row - Top Seller & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Seller & Products */}
          <TopSellersSection
            topSellers={dashboardStats.topSellers}
            topProducts={dashboardStats.topProducts}
          />

          {/* Recent Activity */}
          <RecentOrdersSection recentOrders={dashboardStats.recentOrders} />
        </div>
      </div>
    );
  };

  const renderSellers = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          All Sellers
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          All Products
        </h3>
        <Button
          onClick={() => setShowProductForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
        >
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
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {productsError}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProductList
          productsParam={adminProducts as any}
          showSellerColumn={true}
          onEdit={(product) => setEditingProduct(product)}
          onView={(product) => console.log("View product:", product)}
        />
      </div>

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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Seller Products
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Seller:
          </label>
          <select
            value={selectedSellerFilter ?? ""}
            onChange={(e) => {
              const val = e.target.value || null;
              setSelectedSellerFilter(val);
              setSellerProductsPage(1);
              fetchProducts(val || undefined, 1, PAGE_SIZE);
            }}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex-1 sm:flex-initial"
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
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {productsError}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProductList
          productsParam={adminProducts as any}
          showSellerColumn={true}
          onEdit={(p) => setEditingProduct(p)}
          onView={(p) => console.log(p)}
        />
      </div>

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
    // Debug activeTab and activeSub
    console.log("useMemo activeTab:", activeTab, "activeSub:", activeSub);
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
    // Ensure dashboard updates when stats or loading change
    dashboardStats,
    loadingStats,
  ]);

  if (!withSidebar) {
    // Render just the main content area; parent layout should provide its own sidebar
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6">
        <div className="max-w-[1600px] mx-auto">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        activeSub={activeSub ?? ""}
        items={getAdminNavItems().map((n) => ({
          key: n.id,
          label: n.label,
          children: n.children?.map((c) => ({ key: c.id, label: c.label })),
          // Optional: show pending badge if this view is used standalone
          badge: n.id === "sellers" ? getSellerRequests().length : undefined,
        }))}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 p-3 md:p-4 lg:p-6 xl:p-8">
        <div className="max-w-[1600px] mx-auto">{content}</div>
      </main>
    </div>
  );
}
