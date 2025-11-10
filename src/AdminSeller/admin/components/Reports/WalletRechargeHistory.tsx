import React from "react";
import { Plus } from "lucide-react"; // Using lucide-react for the expand/collapse icon

// Define the data type for the table rows
interface WalletTransactionItem {
  id: number;
  customerName: string;
  amount: number;
}

// Mock data to render the table (matching your design structure)
const transactionData: WalletTransactionItem[] = [
  { id: 1, customerName: "Paul K. Jensen", amount: 99.0 },
  { id: 2, customerName: "Paul K. Jensen", amount: 25.0 },
  { id: 3, customerName: "Paul K. Jensen", amount: 50.0 },
  { id: 4, customerName: "Paul K. Jensen", amount: 80.0 },
  { id: 5, customerName: "Paul K. Jensen", amount: 35.0 },
  { id: 6, customerName: "Paul K. Jensen", amount: 12.15 },
];

const WalletRechargeHistory = () => {
  // NOTE: You would typically use state here to manage which rows are expanded,
  // similar to the ReportsBySeller component.

  return (
    // Outer container matching the card design
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Wallet Transaction Report
      </h2>

      {/* Filter and Category Section */}
      <div className="flex items-end space-x-4 pb-4 border-b border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mr-4">
          Wallet Transaction
        </h3>

        {/* User Dropdown Input */}
        <select
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          defaultValue=""
          style={{ width: "150px" }}
        >
          <option value="" disabled>
            Choose User
          </option>
          <option value="user1">Paul K. Jensen</option>
          <option value="user2">Other User</option>
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
              {/* Invisible/small column for the + icon */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"></th>

              {/* # Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                #
              </th>

              {/* Customer Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Customer
              </th>

              {/* Amount Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactionData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* + Icon (Collapsible Indicator) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                  <Plus className="h-4 w-4" />
                </td>

                {/* # (ID) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.customerName}
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* Format to two decimal places and add currency symbol */}$
                  {item.amount.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletRechargeHistory;
