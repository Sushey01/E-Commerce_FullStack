import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";

// Placeholder hooks and components
const useAuth = () => ({
  user: { name: "Admin User", role: "admin" as "admin" | "seller" },
  logout: () => console.log("Logout"),
  getSellerRequests: () => [] as any[],
});

const useCanAccess = () => ({
  canViewAllSellers: true,
  canManageAllProducts: true,
  canViewSystemAnalytics: true,
  canAccessSystemSettings: true,
  canManageOwnProducts: true,
  canViewOwnSales: true,
  canEditProfile: true,
});

const SellerDashboard = ({ activeTab }: { activeTab: string }) => (
  <div>Seller Dashboard - {activeTab}</div>
);

const ProtectedRoute = ({
  children,
  requiredPermission,
}: {
  children: React.ReactNode;
  requiredPermission: string;
}) => <>{children}</>;

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  permission?: keyof ReturnType<typeof useCanAccess>;
  badge?: number;
}

export default function DashboardLayout() {
  const { user, logout, getSellerRequests } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canAccess = useCanAccess();

  const pendingRequestsCount =
    user?.role === "admin" ? getSellerRequests().length : 0;

  const adminNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    {
      icon: Users,
      label: "Sellers",
      id: "sellers",
      permission: "canViewAllSellers",
    },
    {
      icon: UserCheck,
      label: "Seller Requests",
      id: "seller-requests",
      permission: "canViewAllSellers",
      badge: pendingRequestsCount,
    },
    {
      icon: Package,
      label: "Products",
      id: "products",
      permission: "canManageAllProducts",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      id: "analytics",
      permission: "canViewSystemAnalytics",
    },
    {
      icon: Settings,
      label: "Settings",
      id: "settings",
      permission: "canAccessSystemSettings",
    },
  ];

  const sellerNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    {
      icon: Package,
      label: "My Products",
      id: "products",
      permission: "canManageOwnProducts",
    },
    {
      icon: BarChart3,
      label: "My Sales",
      id: "sales",
      permission: "canViewOwnSales",
    },
    {
      icon: Settings,
      label: "Profile",
      id: "profile",
      permission: "canEditProfile",
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : sellerNavItems;

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return canAccess[item.permission];
  });

  const renderTabContent = () => {
    const currentNavItem = filteredNavItems.find(
      (item) => item.id === activeTab
    );

    if (currentNavItem?.permission) {
      return (
        <ProtectedRoute requiredPermission={currentNavItem.permission}>
          {user?.role === "admin" ? (
            <AdminDashboard activeTab={activeTab} />
          ) : (
            <SellerDashboard activeTab={activeTab} />
          )}
        </ProtectedRoute>
      );
    }

    return user?.role === "admin" ? (
      <AdminDashboard activeTab={activeTab} />
    ) : (
      <SellerDashboard activeTab={activeTab} />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            {user?.role === "admin" ? "Admin Panel" : "Seller Dashboard"}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start relative"
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              {filteredNavItems.find((item) => item.id === activeTab)?.label}
            </h2>
            {user?.role === "admin" &&
              pendingRequestsCount > 0 &&
              activeTab !== "seller-requests" && (
                <Badge variant="destructive" className="text-xs">
                  {pendingRequestsCount} pending request
                  {pendingRequestsCount !== 1 ? "s" : ""}
                </Badge>
              )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Welcome back,</span>
            <span className="text-sm font-medium text-card-foreground">
              {user?.name}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{renderTabContent()}</main>
      </div>
    </div>
  );
}
