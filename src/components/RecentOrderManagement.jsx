import React from "react";

const orders = [
  {
    orderNo: "2095550490781",
    placedOn: "20/10/2024",
    items: "-", // you can add actual items count if you have
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
    <div className="p-4 flex gap-3 flex-col w-full border rounded-lg [box-shadow:0px_-5px_5px_rgba(0,0,0,0.2)] ">
      <div className="py-2 border-b-2">
        <p className="text-lg font-semibold">Recent Orders</p>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Order#
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Placed On
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Items
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Total
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Action
            </th>
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
  );
};

export default RecentOrderManagement;
