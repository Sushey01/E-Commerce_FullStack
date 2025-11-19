import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  LogOut,
  Store,
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";

type SidebarProps = {
  activeTab?: string;
  activeSub?: string | null;
  onNavigate?: (tab: string, sub?: string | null) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  items: Item[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

type Item = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: { key: string; label: string }[];
};

export default function SellerSidebar({
  activeTab,
  activeSub,
  onNavigate,
  onLogout,
  userName,
  userRole,
  items,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  // Ensure only the active parent group opens by default
  useEffect(() => {
    setOpen((prev) => {
      const next: Record<string, boolean> = { ...prev };
      items.forEach((it) => {
        if (it.children) {
          next[it.key] = it.key === activeTab ? true : next[it.key] || false;
        }
      });
      return next;
    });
  }, [activeTab, items]);

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="h-5 w-5" />,
    products: <Package className="h-5 w-5" />,
    sales: <BarChart3 className="h-5 w-5" />,
    profile: <Settings className="h-5 w-5" />,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items
      .map((it) => {
        if (!it.children) return it.label.toLowerCase().includes(q) ? it : null;
        const kids = it.children.filter((c) =>
          c.label.toLowerCase().includes(q)
        );
        if (it.label.toLowerCase().includes(q) || kids.length)
          return { ...it, children: kids.length ? kids : it.children };
        return null;
      })
      .filter(Boolean) as Item[];
  }, [items, query]);

  const handleClick = (tab: string, sub?: string | null) => {
    if (onNavigate) onNavigate(tab, sub);
  };

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-[#0B0C2A] text-white border-r border-white/10 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 py-6 border-b border-white/10">
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="relative">
            <Store className="h-10 w-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
          </div>
          {!collapsed && (
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Seller Dashboard
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in menu"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400/60"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="space-y-1 px-2">
          {filtered.map((item) => {
            const isActive = activeTab === item.key;
            const isGroup = !!item.children;
            return (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center ${
                    collapsed ? "justify-center" : "justify-between"
                  } gap-3 ${
                    collapsed ? "px-0 py-3" : "px-4 py-3"
                  } rounded-xl transition-all duration-200 ${
                    isActive && !isGroup
                      ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 shadow-lg shadow-blue-500/20 border border-blue-500/30"
                      : "hover:bg-white/10 hover:scale-[1.02]"
                  } relative group`}
                  onClick={() =>
                    isGroup
                      ? setOpen((p) => {
                          const currentlyOpen = !!p[item.key];
                          return { [item.key]: !currentlyOpen } as Record<
                            string,
                            boolean
                          >;
                        })
                      : handleClick(item.key)
                  }
                >
                  <span
                    className={`flex items-center gap-3 ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    <span
                      className={`${
                        isActive && !isGroup
                          ? "text-blue-400 scale-110"
                          : "text-white/80"
                      } transition-all duration-200`}
                    >
                      {item.icon || iconMap[item.key]}
                    </span>
                    {!collapsed && (
                      <>
                        <span
                          className={`text-sm font-medium ${
                            isActive && !isGroup
                              ? "text-white"
                              : "text-white/90"
                          }`}
                        >
                          {item.label}
                        </span>
                        {typeof item.badge === "number" && item.badge > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center text-[10px] font-semibold leading-none px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <>
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-200 shadow-xl border border-white/10">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10"></div>
                        {item.label}
                        {typeof item.badge === "number" && item.badge > 0 && (
                          <span className="ml-2 text-blue-400 font-semibold">
                            ({item.badge})
                          </span>
                        )}
                      </div>
                      {typeof item.badge === "number" && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0B0C2A] animate-pulse"></span>
                      )}
                    </>
                  )}
                  {!collapsed &&
                    isGroup &&
                    (open[item.key] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {isGroup && open[item.key] && !collapsed && (
                  <ul className="mt-1 ml-8 space-y-1">
                    {item.children!.map((c) => {
                      const subActive =
                        activeTab === item.key && activeSub === c.key;
                      return (
                        <li key={c.key}>
                          <button
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-white/10 ${
                              subActive ? "bg-white/10" : ""
                            }`}
                            onClick={() => handleClick(item.key, c.key)}
                          >
                            <span className="inline-flex items-center">
                              <span className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-white" />
                              {c.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-white/10 space-y-4">
          {/* User / Logout section */}
          {userName && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight flex-1">
                <div className="text-sm font-semibold text-white">
                  {userName}
                </div>
                {userRole && (
                  <div className="text-xs text-blue-400/80 capitalize font-medium">
                    {userRole.replace("_", " ")}
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          <div className="text-xs text-white/40 text-center">
            © {new Date().getFullYear()} Seller
          </div>
        </div>
      )}
    </aside>
  );
}
