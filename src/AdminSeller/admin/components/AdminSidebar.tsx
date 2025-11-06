import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Store,
  BarChart3,
  Users,
  Settings,
  Search,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react";

type SidebarProps = {
  activeTab?: string;
  activeSub?: string | null;
  onNavigate?: (tab: string, sub?: string | null) => void;
};

type Item = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: { key: string; label: string }[];
};

export default function AdminSidebar({
  activeTab,
  activeSub,
  onNavigate,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  const items: Item[] = useMemo(
    () => [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "products",
        label: "Products",
        icon: <Package className="h-4 w-4" />,
        children: [
          { key: "all-products", label: "All Products" },
          { key: "seller-products", label: "Seller Products" },
          { key: "categories", label: "Categories" },
          { key: "brands", label: "Brands" },
        ],
      },
      {
        key: "sales",
        label: "Sales",
        icon: <BarChart3 className="h-4 w-4" />,
        children: [
          { key: "overall-orders", label: "Overall Orders" },
          { key: "sales-by-seller", label: "Sales by Seller" },
          { key: "unpaid-orders", label: "Paid/Unpaid Orders" },
        ],
      },
      { key: "sellers", label: "Sellers", icon: <Store className="h-4 w-4" /> },
      {
        key: "seller-requests",
        label: "Seller Requests",
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    []
  );

  // Ensure groups containing the active sub are opened by default
  useMemo(() => {
    const next = { ...open };
    items.forEach((it) => {
      if (it.children && activeTab === it.key) next[it.key] = true;
      if (it.children && activeSub) next[it.key] = true;
    });
    setOpen((prev) => ({ ...prev, ...next }));
  }, [activeTab, activeSub]);

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
                      ? setOpen((p) => ({ ...p, [item.key]: !p[item.key] }))
                      : handleClick(item.key)
                  }
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
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

      <div className="p-4 border-t border-white/10 text-xs text-white/60">
        © {new Date().getFullYear()} Admin
      </div>
    </aside>
  );
}
