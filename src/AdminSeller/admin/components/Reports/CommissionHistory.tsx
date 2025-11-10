import React from "react";
// 💡 CORRECT IMPORT: We now use the Plus icon from lucide-react
import { Plus } from "lucide-react";

// Define the data type for the table rows
interface CommissionItem {
  id: number;
  adminCommission: number;
  sellerEarning: number;
}

// Mock data to render the table
const commissionData: CommissionItem[] = [
  { id: 1, adminCommission: 27.25, sellerEarning: 81.75 },
  { id: 2, adminCommission: 77.5, sellerEarning: 232.49 },
  { id: 3, adminCommission: 144.75, sellerEarning: 434.25 },
  { id: 4, adminCommission: 144.75, sellerEarning: 434.25 },
  { id: 5, adminCommission: 19, sellerEarning: 60 },
  { id: 6, adminCommission: 289.5, sellerEarning: 868.5 },
];

const CommissionHistory = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Commission History report
      </h2>

      {/* Filter and Category Section */}
      <div className="flex items-end space-x-4 pb-4 border-b border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mr-4">
          Commission History
        </h3>

        {/* Seller Dropdown Input */}
        <select
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          defaultValue=""
          style={{ width: "150px" }}
        >
          <option value="" disabled>
            Choose Seller
          </option>
          <option value="seller1">Seller A</option>
          <option value="seller2">Seller B</option>
        </select>

        {/* Date Range Input (Mocked) */}
        <input
          type="text"
          placeholder="Daterange"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          style={{ width: "150px" }}
        />

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Admin Commission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Seller Earning
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissionData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* + Icon (Collapsible Indicator) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                  {/* Use the Plus component from lucide-react */}
                  <Plus className="h-4 w-4" />
                </td>

                {/* # (ID) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>

                {/* Admin Commission */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.adminCommission.toFixed(2)}
                </td>

                {/* Seller Earning */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.sellerEarning.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionHistory;
