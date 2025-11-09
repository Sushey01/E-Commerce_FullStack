import { ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  Store,
  Megaphone,
} from "lucide-react";

export type NavChild = {
  id: string;
  label: string;
};

export type NavItemConfig = {
  id: string;
  label: string;
  icon?: ReactNode;
  permission?: string;
  children?: NavChild[];
};

export const getAdminNavItems = (): NavItemConfig[] => [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "sellers",
    label: "Sellers",
    permission: "canViewAllSellers",
    children: [
      { id: "all-sellers", label: "All Sellers" },
      { id: "seller-requests", label: "Seller Requests" },
    ],
  },
  {
    id: "products",
    label: "Products",
    permission: "canManageAllProducts",
    children: [
      { id: "all-products", label: "All Products" },
      { id: "seller-products", label: "Seller Products" },
      { id: "categories", label: "Categories" },
      { id: "brands", label: "Brands" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    permission: "canViewSystemAnalytics",
    children: [
      { id: "overall-orders", label: "Overall Orders" },
      { id: "sales-by-seller", label: "Sales by Seller" },
      { id: "unpaid-orders", label: "Unpaid Orders" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    // visible to all admins (no specific permission check yet)
    children: [
      { id: "flash-deals", label: "Flash Deals" },
      { id: "dynamic-popup", label: "Dynamic Pop-ups" },
      { id: "coupons", label: "Coupons" },
    ],
  },
    {
    id: "reports",
    label: "Reports",
    permission: "canViewSystemAnalytics",
    children: [
      { id: "total-earning-report", label: "Total Earnings" },
      { id: "report-by-sellers-product", label: "Reports by Sellers product" },
      { id: "products-stock", label: "Products Stock " },
      { id: "user-searches", label: "User Searches" },
      { id: "commission-history", label: "Commission History" },
      { id: "wallet-recharge-history", label: "Wallet Recharge History" },
    ],
  },
  { id: "settings", label: "Settings", permission: "canAccessSystemSettings" },
];

export const getSellerNavItems = (): NavItemConfig[] => [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "My Products", permission: "canManageOwnProducts" },
  { id: "sales", label: "My Sales", permission: "canViewOwnSales" },
  { id: "profile", label: "Profile", permission: "canEditProfile" },
];
