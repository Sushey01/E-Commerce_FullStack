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

      {/* Sidebar (replaced with dark AdminSidebar) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
          <div className="h-full bg-gray-300 border-r border-sidebar-border flex flex-col">
            <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
              <h1 className="text-xl font-bold text-sidebar-foreground">
                Seller Dashboard
              </h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {filteredNavItems.map((item) => {
                const hasChildren =
                  Array.isArray(item.children) && item.children.length > 0;
                const isExpanded = !!expanded[item.id];
                const isActiveParent = activeTab === item.id;
                return (
                  <div key={item.id} className="space-y-1">
                    <Button
                      variant={isActiveParent ? "secondary" : "ghost"}
                      className="w-full justify-between relative"
                      onClick={() => {
                        if (hasChildren) {
                          setExpanded((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }));
                          setActiveTab(item.id);
                          setActiveSub(null);
                          setSidebarOpen(false);
                        } else {
                          setActiveTab(item.id);
                          setActiveSub(null);
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {sellerIconMap[item.id] || null}
                        {item.label}
                      </div>
                      {hasChildren && (
                        <span className="ml-auto">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                      )}
                    </Button>
                    {hasChildren && isExpanded && (
                      <div className="pl-8 space-y-1">
                        {item.children?.map(
                          (child: { id: string; label: string }) => (
                            <Button
                              key={child.id}
                              variant="ghost"
                              className="w-full justify-start text-sm"
                              onClick={() => {
                                setActiveTab(item.id);
                                setActiveSub(child.id);
                                setSidebarOpen(false);
                              }}
                            >
                              {child.label}
                            </Button>
                          )
                        )}
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
                className="w-full bg-white justify-center"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        )}
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
            <span className="rounded-full border p-2 bg-gray-300"> <User /></span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-2">{renderTabContent()}</main>
      </div>
    </div>
  );
}
