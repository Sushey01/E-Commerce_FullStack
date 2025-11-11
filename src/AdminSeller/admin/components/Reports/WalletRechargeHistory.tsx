import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import supabase from "../../../../supabase";
import Pagination from "../Pagination";

// Define the data type for the table rows
interface WalletTransactionItem {
  id: string;
  user_id: string;
  customer_name: string;
  amount: number;
  transaction_type?: string;
  created_at?: string;
}

interface User {
  id: string;
  full_name: string;
  email?: string;
}

const WalletRechargeHistory = () => {
  const [transactionData, setTransactionData] = useState<
    WalletTransactionItem[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email")
          .order("full_name", { ascending: true });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch wallet transactions with pagination
  const fetchTransactions = async (
    page: number,
    userFilter: string = "",
    dateStart: string = "",
    dateEnd: string = ""
  ) => {
    setLoading(true);
    console.log(
      "💳 [WalletRechargeHistory] Fetching transactions - Page:",
      page,
      "User:",
      userFilter
    );

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("wallet_transactions")
        .select(
          `
          id,
          user_id,
          amount,
          transaction_type,
          created_at,
          users(id, full_name)
        `,
          { count: "exact" }
        )
        .eq("transaction_type", "recharge")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (userFilter) {
        query = query.eq("user_id", userFilter);
      }

      if (dateStart) {
        query = query.gte("created_at", dateStart);
      }

      if (dateEnd) {
        query = query.lte("created_at", dateEnd);
      }

      const { data, error, count } = await query;

      console.log("💳 [WalletRechargeHistory] Response:", {
        dataCount: data?.length,
        totalCount: count,
        error: error?.message,
        sample: data?.[0],
      });

      if (error) {
        console.error(
          "❌ [WalletRechargeHistory] Error fetching wallet transactions:",
          error
        );
        setTransactionData([]);
        setTotalCount(0);
      } else {
        const processedData: WalletTransactionItem[] = (data || []).map(
          (item: any) => ({
            id: item.id,
            user_id: item.user_id,
            customer_name: item.users?.full_name || "Unknown User",
            amount: item.amount || 0,
            transaction_type: item.transaction_type,
            created_at: item.created_at,
          })
        );

        setTransactionData(processedData);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error(
        "❌ [WalletRechargeHistory] Error fetching transactions:",
        err
      );
      setTransactionData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, selectedUser, startDate, endDate);
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchTransactions(1, selectedUser, startDate, endDate);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.email || "Unknown"}
            </option>
          ))}
        </select>

        {/* Date Range Inputs */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          style={{ width: "150px" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          style={{ width: "150px" }}
        />

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition h-10"
        >
          Filter
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Report Table */}
      {!loading && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No wallet transactions found
                    </td>
                  </tr>
                ) : (
                  transactionData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                        <Plus className="h-4 w-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.amount.toFixed(2)}
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
              label="transactions"
            />
          )}
        </>
      )}
    </div>
  );
};

export default WalletRechargeHistory;
