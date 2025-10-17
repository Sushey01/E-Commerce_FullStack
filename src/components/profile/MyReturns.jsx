import React from "react";

const rows = [
  {
    id: "RET-2001",
    orderId: "ORD-10021",
    date: "2025-10-06",
    item: "Wireless Mouse",
    status: "Approved",
  },
  {
    id: "RET-2002",
    orderId: "ORD-10019",
    date: "2025-09-25",
    item: "Phone Case",
    status: "Pending",
  },
];

const Status = ({ s }) => {
  const color =
    s === "Approved"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{s}</span>
  );
};

const MyReturns = () => {
  return (
    <div className="p-2 space-y-3">
      <h2 className="text-xl font-semibold">My Returns</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">Return ID</th>
              <th className="border p-2 text-left">Order ID</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.orderId}</td>
                <td className="border p-2">{r.date}</td>
                <td className="border p-2">{r.item}</td>
                <td className="border p-2">
                  <Status s={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReturns;
