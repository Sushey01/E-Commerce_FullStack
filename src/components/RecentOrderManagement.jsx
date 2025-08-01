import React from "react";

const orders = [
  {
    orderNo: "2095550490781",
    placedOn: "20/10/2024",
    items: "-",
    total: "Rs. 669",
  },
  {
    orderNo: "2095550490782",
    placedOn: "21/10/2024",
    items: "-",
    total: "Rs. 799",
  },
  {
    orderNo: "2095550490783",
    placedOn: "22/10/2024",
    items: "-",
    total: "Rs. 899",
  },
];

const RecentOrderManagement = () => {
  return (
    <div className="p-4 flex flex-col gap-3 w-full border rounded-lg shadow-md">
      <div className="py-2 border-b-2">
        <p className="text-lg font-semibold">Recent Orders</p>
      </div>

      {/* For desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Order#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Placed On</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Items</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ orderNo, placedOn, items, total }, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                <td className="border border-gray-300 px-4 py-2">{orderNo}</td>
                <td className="border border-gray-300 px-4 py-2">{placedOn}</td>
                <td className="border border-gray-300 px-4 py-2">{items}</td>
                <td className="border border-gray-300 px-4 py-2">{total}</td>
                <td className="border border-gray-300 px-4 py-2 text-blue-600 hover:underline">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* For mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.map(({ orderNo, placedOn, items, total }, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded p-3 shadow-sm text-sm"
          >
            <div className="flex justify-between">
              <span className="font-medium">Order#</span>
              <span>{orderNo}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">Placed On</span>
              <span>{placedOn}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">Items</span>
              <span>{items}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-medium">Total</span>
              <span>{total}</span>
            </div>
            <div className="mt-2 text-right text-blue-600 font-medium text-sm hover:underline">
              View Details
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrderManagement;
