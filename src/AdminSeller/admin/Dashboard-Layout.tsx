import type React from "react";
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
import SellerDashboard from "../seller/SellerDashboard";

// Real Supabase authentication hook
import { useEffect, useState } from "react";
import supabase from "../../supabase";

const useAuth = () => {
  const [user, setUser] = useState<{
    name: string;
    role: "admin" | "seller" | "customer";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error || !authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user profile with role
        const { data: profile } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", authUser.id)
          .single();

        if (profile) {
          setUser({
            name: profile.full_name || authUser.email || "User",
            role: profile.role || "customer",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return {
    user,
    loading,
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
    getSellerRequests: () => [] as any[],
  };
};

const useCanAccess = () => ({
  canViewAllSellers: true,
  canManageAllProducts: true,
  canViewSystemAnalytics: true,
  canAccessSystemSettings: true,
  canManageOwnProducts: true,
  canViewOwnSales: true,
  canEditProfile: true,
});

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
  children?:
    | {
        label: string;
        id: string;
      }[]
    | undefined;
}

export default function DashboardLayout() {
  const { user, loading, logout, getSellerRequests } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //Track expanded dropdowns sepearately so expand/collapse doesn't change activeTab
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const canAccess = useCanAccess();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = "/loginPage";
    return null;
  }

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
      children: [
        { label: "All Products", id: "all-products" },
        { label: "Seller Products", id: "seller-products" },
        { label: "Categories", id: "categories" },
        { label: "Brands", id: "brands" },
      ],
    },
    {
      icon: BarChart3,
      label: "Sales",
      id: "sales",
      permission: "canViewSystemAnalytics",
      children:[
        {label: "All Orders", id: "overall-orders"},
        {label: "Sales by Seller", id: "sales-by-seller"},
        {label: "Unpaid Orders", id:"unpaid-orders"},
      ]
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
            <AdminDashboard activeTab={activeTab} activeSub={activeSub} />
          ) : (
            <SellerDashboard activeTab={activeTab} />
          )}
        </ProtectedRoute>
      );
    }

    return user?.role === "admin" ? (
      <AdminDashboard activeTab={activeTab} activeSub={activeSub} />
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
      {/* sidebar has a transparent color in the global css but i used gray-300 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-300 border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
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
          {filteredNavItems.map((item) => {
            const hasChildren =
              Array.isArray(item.children) && item.children.length > 0;
            // Use separate expanded state so expand/collapse doesn't change activeTab
            const isExpanded = !!expanded[item.id];
            const isActiveParent = activeTab === item.id;

            return (
              <div key={item.id} className="space-y-1">
                {/* Parent item */}
                <Button
                  variant={isActiveParent ? "secondary" : "ghost"}
                  // variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-between relative"
                  onClick={() => {
                    if (hasChildren) {
                      // toggle expand/collapse state
                      setExpanded((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));

                      // set parent as active so its main view (All Products) is selectable
                      setActiveTab(item.id);

                      // Clear any selected sub so parent shows its 'All' view
                      setActiveSub(null);

                      // Close sidebar on mobile when selecting parent
                      setSidebarOpen(false);
                    } else {
                      setActiveTab(item.id);
                      setActiveSub(null);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </div>

                  {/* Show dropdown arrow if children exist */}
                  {hasChildren && (
                    <span className="ml-auto">{isExpanded ? "▾" : "▸"}</span>
                  )}

                  {/* Optional badge */}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="pending"
                      className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>

                {/* Dropdown children */}
                {hasChildren && isExpanded && (
                  <div className="pl-8 space-y-1">
                    {item.children?.map((child) => (
                      <Button
                        key={child.id}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          // Keep parent as activeTab and set activeSub to indicate the selected child
                          setActiveTab(item.id);
                          setActiveSub(child.id);
                          setSidebarOpen(false);
                        }}
                      >
                        {child.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
        <div className="h-16 bg-white md:bg-gray-50 border-b border-border flex items-center justify-between px-6 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 text-gray-700" />
          </Button>

          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              {filteredNavItems.find((item) => item.id === activeTab)?.label}
            </h2>
            {user?.role === "admin" &&
              pendingRequestsCount > 0 &&
              activeTab !== "seller-requests" && (
                <Badge variant="pending" className="text-xs">
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
