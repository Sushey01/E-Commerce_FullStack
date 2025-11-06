import React, { FC, useState } from "react";

interface Order {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: 250.75,
    dueDate: "2025-11-10",
    status: "pending",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: 480.0,
    dueDate: "2025-11-08",
    status: "overdue",
  },
  {
    id: "ORD-003",
    customer: "Chris Evans",
    amount: 129.99,
    dueDate: "2025-11-12",
    status: "pending",
  },
  {
    id: "ORD-004",
    customer: "Emma Johnson",
    amount: 520.5,
    dueDate: "2025-10-29",
    status: "paid",
  },
  {
    id: "ORD-005",
    customer: "Robert Brown",
    amount: 310.0,
    dueDate: "2025-11-01",
    status: "paid",
  },
];

const PaidUnpaidOrders: FC = () => {
  const [activeTab, setActiveTab] = useState<"paid" | "unpaid">("unpaid");

  const filteredOrders = mockOrders.filter((order) =>
    activeTab === "paid" ? order.status === "paid" : order.status !== "paid"
  );

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

      {filteredOrders.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No {activeTab === "paid" ? "paid" : "unpaid"} orders found 🎉
        </div>
      ) : (
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
            {filteredOrders.map((order) => (
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

      {activeTab === "unpaid" && (
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
