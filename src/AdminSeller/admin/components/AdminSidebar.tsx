import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  LogOut,
  BadgeDollarSign,
  LayoutDashboard,
  Store,
  Users,
  Package,
  BarChart3,
  Settings,
  Megaphone,
  Tag,
} from "lucide-react";

type SidebarProps = {
  activeTab?: string;
  activeSub?: string | null;
  onNavigate?: (tab: string, sub?: string | null) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  items: Item[];
};

type Item = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: { key: string; label: string }[];
};

export default function AdminSidebar({
  activeTab,
  activeSub,
  onNavigate,
  onLogout,
  userName,
  userRole,
  items,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  // Ensure only the active parent group opens by default; avoid opening all when any sub is active
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
    dashboard: <LayoutDashboard className="h-4 w-4" />,
    sellers: <Store className="h-4 w-4" />,
    products: <Package className="h-4 w-4" />,
    sales: <BarChart3 className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    marketing: <Megaphone className="h-4 w-4" />,
    reports: <BarChart3 className="h-4 w-4" />,
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
    <aside className="flex flex-col w-64 h-screen sticky top-0 bg-[#0B0C2A] text-white border-r border-white/10">
      <div className="p-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-8 w-8 text-orange-400" />
          <div className="text-lg font-semibold">Sowis eCommerce</div>
        </div>
        <div className="mt-3 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in menu"
            className="w-full pl-9 pr-3 py-2 rounded-md bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400/60"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-2">
          {filtered.map((item) => {
            const isActive = activeTab === item.key;
            const isGroup = !!item.children;
            return (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors hover:bg-white/10 ${
                    isActive && !isGroup ? "bg-white/10" : ""
                  }`}
                  onClick={() =>
                    isGroup
                      ? setOpen((p) => {
                          const currentlyOpen = !!p[item.key];
                          // single-open behavior: close others
                          return { [item.key]: !currentlyOpen } as Record<
                            string,
                            boolean
                          >;
                        })
                      : handleClick(item.key)
                  }
                >
                  <span className="flex items-center gap-2">
                    {item.icon || iconMap[item.key]}
                    <span className="text-sm">{item.label}</span>
                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isGroup &&
                    (open[item.key] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {isGroup && open[item.key] && (
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

      <div className="p-4 border-t border-white/10">
        {/* User / Logout section */}
        {userName && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-white">{userName}</div>
              {userRole && (
                <div className="text-xs text-white/60 capitalize">
                  {userRole.replace("_", " ")}
                </div>
              )}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
        >
          <LogOut className="h-4 w-4" /> <span>Sign Out</span>
        </button>
        <div className="mt-4 text-xs text-white/50">
          © {new Date().getFullYear()} Admin
        </div>
      </div>
    </aside>
  );
}
