import React from "react";

// Define the data type for the table rows
interface UserSearchItem {
  id: number;
  searchQuery: string;
  count: number;
}

// Mock data to render the table (matching your design)
const userSearchData: UserSearchItem[] = [
  { id: 1, searchQuery: "", count: 11 }, // Blank search query for row 1
  {
    id: 2,
    searchQuery:
      "Women's Slim-Fit Layering Long Sleeve Knit Rib Crew Neck (Available in Plus Size), Pack of 2",
    count: 11,
  },
  { id: 3, searchQuery: "", count: 9 }, // Blank search query for row 3
  { id: 4, searchQuery: "apple", count: 8 },
  { id: 5, searchQuery: "a", count: 7 },
  {
    id: 6,
    searchQuery:
      "Baby Balance Bikes Toys for 1 Year Old Boys Girls 10-24 Months",
    count: 6,
  },
];

const UserSearches = () => {
  return (
    // Outer container matching the card design
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        User Search Report
      </h2>

      {/* Report Table Container */}
      <div className="overflow-x-auto border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {/* # Column (small width) */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                #
              </th>
              {/* Search By Column (main width) */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">
                Search By
              </th>
              {/* Number Searches Column (right aligned) */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Number searches
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userSearchData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* # (ID) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>

                {/* Search By (Query) */}
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                  {item.searchQuery || "-"}{" "}
                  {/* Use '-' for blank queries if preferred */}
                </td>

                {/* Number searches (Count) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {item.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSearches;
