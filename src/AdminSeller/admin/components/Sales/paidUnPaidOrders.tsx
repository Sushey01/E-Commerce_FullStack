import React, { FC, useEffect, useMemo, useState } from "react";
import supabase from "../../../../supabase";

type UiStatus = "paid" | "pending" | "overdue";

type UiOrder = {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: UiStatus;
};

const PaidUnpaidOrders: FC = () => {
  const [activeTab, setActiveTab] = useState<"paid" | "unpaid">("unpaid");
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async (tab: "paid" | "unpaid") => {
    setLoading(true);
    setError(null);
    try {
      // 1) Fetch orders by payment state
      const base = supabase
        .from("orders")
        .select("id,user_id,total,created_at,paid_amount,status,expires_at")
        .order("created_at", { ascending: false })
        .limit(200);

      const { data: ordData, error: ordErr } =
        tab === "paid"
          ? await base.gt("paid_amount", 0)
          : await base.eq("paid_amount", 0);
      if (ordErr) throw new Error(ordErr.message);

      const ordersRaw = ordData || [];

      // 2) Resolve customer names
      const userIds = Array.from(
        new Set(ordersRaw.map((o: any) => o.user_id).filter(Boolean))
      );
      let usersMap: Record<string, { full_name?: string; email?: string }> = {};
      if (userIds.length) {
        const { data: users, error: usersErr } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);
        if (usersErr) throw new Error(usersErr.message);
        usersMap = (users || []).reduce((acc: any, u: any) => {
          acc[u.id] = { full_name: u.full_name, email: u.email };
          return acc;
        }, {} as Record<string, { full_name?: string; email?: string }>);
      }

      // 3) Normalize for UI
      const now = new Date();
      const ui: UiOrder[] = ordersRaw.map((o: any) => {
        const customer =
          usersMap[o.user_id]?.full_name ||
          usersMap[o.user_id]?.email ||
          "Unknown";
        const due = o.expires_at || o.created_at;
        const dueDate = due ? new Date(due).toISOString().slice(0, 10) : "";
        let status: UiStatus = "pending";
        if (Number(o.paid_amount) > 0) status = "paid";
        else if (due && new Date(due) < now && o.status !== "Cancelled")
          status = "overdue";
        else status = "pending";
        return {
          id: o.id,
          customer,
          amount: Number(o.total || 0),
          dueDate,
          status,
        };
      });

      setOrders(ui);
    } catch (e: any) {
      setError(e.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const hasOrders = orders.length > 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Orders Overview
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("unpaid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "unpaid"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unpaid Orders
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "paid"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Paid Orders
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-gray-500 text-center py-10">Loading orders…</div>
      )}

      {!loading && error && (
        <div className="text-red-600 text-center py-10">{error}</div>
      )}

      {!loading && !error && !hasOrders && (
        <div className="text-gray-500 text-center py-10">
          No {activeTab === "paid" ? "paid" : "unpaid"} orders found
        </div>
      )}

      {!loading && !error && hasOrders && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-gray-700 font-medium">Order ID</th>
              <th className="p-3 text-gray-700 font-medium">Customer</th>
              <th className="p-3 text-gray-700 font-medium">Amount</th>
              <th className="p-3 text-gray-700 font-medium">Due Date</th>
              <th className="p-3 text-gray-700 font-medium text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 font-medium text-gray-800">{order.id}</td>
                <td className="p-3 text-gray-600">{order.customer}</td>
                <td className="p-3 text-gray-800">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="p-3 text-gray-600">{order.dueDate}</td>
                <td className="p-3 text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && activeTab === "unpaid" && hasOrders && (
        <div className="flex justify-end mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            Send Reminders
          </button>
        </div>
      )}
    </div>
  );
};

export default PaidUnpaidOrders;
