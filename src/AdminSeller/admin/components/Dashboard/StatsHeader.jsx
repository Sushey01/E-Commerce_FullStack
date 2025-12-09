import { Card, CardContent } from "../../ui/card";

export default function StatsHeader({ stats, user }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-xl shadow-lg p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Total Sales</p>
              <p className="text-xl font-bold">
                ${stats.totalSales?.toLocaleString?.() ?? 0}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Orders</p>
              <p className="text-xl font-bold">{stats.totalOrders ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Products</p>
              <p className="text-xl font-bold">{stats.totalProducts ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
