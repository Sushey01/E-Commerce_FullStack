import React, { useState } from "react";
import { Plus, Minus } from "lucide-react"; // Using lucide-react icons

// Define the data type for the table rows
interface SellerReportItem {
  id: number;
  sellerName: string;
  orderAmount: number;
  shopName: string;
  productSaleCount: number;
}

// Mock data to render the table
const sellerData: SellerReportItem[] = [
  // First item is shown as expanded in the design
  {
    id: 1,
    sellerName: "LOUIS VUITTON",
    orderAmount: 2404.3,
    shopName: "LOUIS VUITTON",
    productSaleCount: 22,
  },
  {
    id: 2,
    sellerName: "adidas",
    orderAmount: 480.4,
    shopName: "Adidas Official",
    productSaleCount: 8,
  },
  {
    id: 3,
    sellerName: "Philpps",
    orderAmount: 504.18,
    shopName: "Philpps Lighting",
    productSaleCount: 15,
  },
];

const ReportsBySeller = () => {
  // State to manage which row is currently expanded
  const [expandedId, setExpandedId] = useState<number | null>(1); // Start with ID 1 expanded

  const toggleExpansion = (id: number) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    // Outer container matching the card design
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Seller Based Selling Report
      </h2>

      {/* Filter Section */}
      <div className="flex items-end space-x-4 pb-4 border-b border-gray-200 mb-6">
        <label className="text-sm font-medium text-gray-700">
          Sort by verification status :
        </label>

        {/* Status Dropdown Input */}
        <select
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          defaultValue="Approved"
          style={{ width: "150px" }}
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Filter Button */}
        <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition h-10">
          Filter
        </button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="border-b border-gray-200">
              {/* Invisible/small column for the icon */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"></th>

              {/* Seller Name Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/5">
                Seller Name
              </th>

              {/* Order Amount Column */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Order Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellerData.map((item) => (
              <React.Fragment key={item.id}>
                {/* 1. Main Row */}
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpansion(item.id)}
                >
                  {/* Expansion Icon */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                    {expandedId === item.id ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </td>

                  {/* Seller Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.sellerName}
                  </td>

                  {/* Order Amount */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    $
                    {item.orderAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 3,
                    })}
                  </td>
                </tr>

                {/* 2. Collapsible Detail Rows */}
                {expandedId === item.id && (
                  <>
                    {/* Shop Name Detail Row */}
                    <tr className="bg-gray-50">
                      <td
                        colSpan={2}
                        className="px-6 py-2 text-left text-xs text-gray-500 pl-16"
                      >
                        Shop Name
                      </td>
                      <td
                        colSpan={1}
                        className="px-6 py-2 text-left text-sm font-medium text-gray-800"
                      >
                        {item.shopName}
                      </td>
                    </tr>

                    {/* Number of Product Sale Detail Row */}
                    <tr className="bg-gray-50">
                      <td
                        colSpan={2}
                        className="px-6 py-2 text-left text-xs text-gray-500 pl-16"
                      >
                        Number of Product Sale
                      </td>
                      <td
                        colSpan={1}
                        className="px-6 py-2 text-left text-sm font-medium text-gray-800"
                      >
                        {item.productSaleCount.toLocaleString()}
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsBySeller;
