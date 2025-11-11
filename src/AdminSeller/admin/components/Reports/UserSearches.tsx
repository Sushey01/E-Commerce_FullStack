import React, { useState, useEffect } from "react";
import supabase from "../../../../supabase";
import Pagination from "../Pagination";

// Define the data type for the table rows
interface UserSearchItem {
  id: string;
  search_query: string;
  search_count: number;
  created_at?: string;
}

const UserSearches = () => {
  const [userSearchData, setUserSearchData] = useState<UserSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch user search data with pagination
  const fetchUserSearches = async (page: number) => {
    setLoading(true);
    console.log("🔍 [UserSearches] Fetching searches - Page:", page);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Try to fetch from user_searches table if it exists
      const { data, error, count } = await supabase
        .from("user_searches")
        .select("id, search_query, search_count, created_at", {
          count: "exact",
        })
        .order("search_count", { ascending: false })
        .range(from, to);

      console.log("🔍 [UserSearches] Response:", {
        dataCount: data?.length,
        totalCount: count,
        error: error?.message,
        sample: data?.[0],
      });

      if (error) {
        console.error("❌ [UserSearches] Error fetching user searches:", error);
        // If table doesn't exist, show empty state
        setUserSearchData([]);
        setTotalCount(0);
      } else {
        setUserSearchData(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error("❌ [UserSearches] Error fetching user searches:", err);
      setUserSearchData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSearches(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  return (
    // Outer container matching the card design
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        User Search Report
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Report Table Container */}
      {!loading && (
        <>
          <div className="overflow-x-auto border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">
                    Search By
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Number searches
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userSearchData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No search data found
                    </td>
                  </tr>
                ) : (
                  userSearchData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                        {item.search_query || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {(item.search_count || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              pageSize={itemsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              label="searches"
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserSearches;
