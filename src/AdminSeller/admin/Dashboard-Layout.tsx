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
  User,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import SellerDashboard from "../seller/SellerDashboard";
import AdminSidebar from "./components/AdminSidebar";
import SellerSidebar from "../seller/components/SellerSidebar";
import AddNewCatBrand from "./ui/addnewcatbrand";
import {
  getAdminNavItems,
  getSellerNavItems,
  NavItemConfig,
} from "./navConfig";
import { useNavigate, useParams } from "react-router-dom";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const params = useParams<{ tab?: string; sub?: string }>();
  const navigate = useNavigate();

  //Track expanded dropdowns sepearately so expand/collapse doesn't change activeTab
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const canAccess = useCanAccess();
  // Icon map for seller sidebar (non-admin) using ids from navConfig
  const sellerIconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="mr-3 h-4 w-4" />,
    products: <Package className="mr-3 h-4 w-4" />,
    sales: <BarChart3 className="mr-3 h-4 w-4" />,
    profile: <Settings className="mr-3 h-4 w-4" />,
  };

  // Sync URL params -> UI state
  useEffect(() => {
    if (params?.tab) {
      // Backward compatibility: if old route '/admin/seller-requests' is hit, remap
      if (params.tab === "seller-requests") {
        setActiveTab("sellers");
        setActiveSub("seller-requests");
      } else {
        setActiveTab(params.tab);
      }
    }
    if (params) {
      // If sub is defined in params but possibly empty, coerce to null
      setActiveSub(params.sub ?? null);
    }
  }, [params.tab, params.sub]);

  // Ensure consistent hook order across renders: avoid early returns that skip later hooks.
  // Handle redirect side-effect when not authenticated once loading completes.
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/loginPage";
    }
  }, [loading, user]);

  const pendingRequestsCount =
    user?.role === "admin" ? getSellerRequests().length : 0;

  // Flash deals badge removed until flash_deals table actually exists.
  // const [flashDealsCount, setFlashDealsCount] = useState<number>(0);

  // Build nav items from shared config; inject dynamic badges where needed
  const baseNav: NavItemConfig[] =
    user?.role === "admin" ? getAdminNavItems() : getSellerNavItems();
  const navItems = baseNav.map((item) => {
    if (item.id === "sellers") {
      // Attach pending requests badge to sellers parent
      return { ...item, badge: pendingRequestsCount } as any;
    }
    // Marketing badge disabled (no flash_deals table yet)
    return item;
  });

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    // @ts-expect-error index signature for permission keys
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
            <AdminDashboard
              activeTab={activeTab}
              activeSub={activeSub}
              withSidebar={false}
              user={user}
            />
          ) : (
            <SellerDashboard activeTab={activeTab} />
          )}
        </ProtectedRoute>
      );
    }

    return user?.role === "admin" ? (
      <AdminDashboard
        activeTab={activeTab}
        activeSub={activeSub}
        withSidebar={false}
        user={user}
      />
    ) : (
      <SellerDashboard activeTab={activeTab} />
    );
  };

  // Loading state UI (rendered without aborting remaining hooks)
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

  // If user is still null after loading, show nothing (redirect effect fired)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop overlay when sidebar is not collapsed - click outside to collapse */}
      {!sidebarCollapsed && (
        <div
          className="hidden lg:block fixed inset-0 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar (replaced with dark AdminSidebar) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {user?.role === "admin" ? (
          <AdminSidebar
            activeTab={activeTab}
            activeSub={activeSub}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              console.log("Toggle sidebar:", !sidebarCollapsed);
              setSidebarCollapsed(!sidebarCollapsed);
            }}
            items={navItems.map((n: NavItemConfig) => ({
              key: n.id,
              label: n.label,
              icon: n.icon,
              children:
                n.children?.map((c: { id: string; label: string }) => ({
                  key: c.id,
                  label: c.label,
                })) || undefined,
              badge: (n as any).badge,
            }))}
            onNavigate={(tab, sub) => {
              setActiveTab(tab);
              setActiveSub(sub ?? null);
              setSidebarOpen(false);
              navigate(`/admin/${tab}${sub ? `/${sub}` : ""}`, {
                replace: false,
              });
            }}
            onLogout={logout}
            userName={user.name}
            userRole={user.role}
          />
        ) : (
          <SellerSidebar
            activeTab={activeTab}
            activeSub={activeSub}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            items={navItems.map((n: NavItemConfig) => ({
              key: n.id,
              label: n.label,
              icon: n.icon,
              children:
                n.children?.map((c: { id: string; label: string }) => ({
                  key: c.id,
                  label: c.label,
                })) || undefined,
              badge: (n as any).badge,
            }))}
            onNavigate={(tab, sub) => {
              setActiveTab(tab);
              setActiveSub(sub ?? null);
              setSidebarOpen(false);
            }}
            onLogout={logout}
            userName={user.name}
            userRole={user.role}
          />
        )}
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top bar */}
        <div className="h-16 bg-white md:bg-gray-50 border-b border-border flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4 text-gray-700" />
            </Button>
            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4 text-gray-700" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              {(() => {
                const parent = filteredNavItems.find(
                  (item) => item.id === activeTab
                );
                if (parent?.children && activeSub) {
                  const child = parent.children.find(
                    (c: { id: string }) => c.id === activeSub
                  );
                  return child?.label || parent.label;
                }
                return parent?.label || "Dashboard";
              })()}
            </h2>
            {user?.role === "admin" && activeTab === "dashboard" && (
              <AddNewCatBrand />
            )}
            {user?.role === "admin" &&
              pendingRequestsCount > 0 &&
              !(activeTab === "sellers" && activeSub === "seller-requests") && (
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
            <span className="rounded-full border p-2 bg-gray-300">
              {" "}
              <User />
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-2">{renderTabContent()}</main>
      </div>
    </div>
  );
}
