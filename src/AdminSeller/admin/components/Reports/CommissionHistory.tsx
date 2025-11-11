import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import supabase from "../../../../supabase";
import Pagination from "../Pagination";

// Define the data type for the table rows
interface CommissionItem {
  id: string;
  order_id: string;
  admin_commission: number;
  seller_earning: number;
  seller_id?: string;
  created_at?: string;
}

interface Seller {
  id: string;
  shop_name: string;
  seller_name?: string;
}

const CommissionHistory = () => {
  const [commissionData, setCommissionData] = useState<CommissionItem[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        console.log("👤 [CommissionHistory] Fetching sellers...");
        const { data, error } = await supabase
          .from("sellers")
          .select("seller_id, company_name, user_id")
          .eq("status", "approved")
          .order("company_name", { ascending: true });

        console.log("👤 [CommissionHistory] Sellers:", {
          count: data?.length,
          error: error?.message,
        });

        if (error) throw error;
        setSellers(
          (data || []).map((s) => ({
            id: s.seller_id,
            shop_name: s.company_name || "Unknown",
            seller_name: s.company_name || "Unknown",
          }))
        );
      } catch (err) {
        console.error("❌ [CommissionHistory] Error fetching sellers:", err);
      }
    };
    fetchSellers();
  }, []);

  // Fetch commission data with pagination
  const fetchCommissions = async (
    page: number,
    sellerFilter: string = "",
    dateStart: string = "",
    dateEnd: string = ""
  ) => {
    setLoading(true);
    console.log(
      "💰 [CommissionHistory] Fetching commissions - Page:",
      page,
      "Seller:",
      sellerFilter,
      "Date Range:",
      dateStart,
      "-",
      dateEnd
    );

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // First, fetch orders with filters
      let ordersQuery = supabase
        .from("orders")
        .select("id, seller_id, created_at", { count: "exact" });

      if (sellerFilter) {
        ordersQuery = ordersQuery.eq("seller_id", sellerFilter);
      }

      if (dateStart) {
        ordersQuery = ordersQuery.gte("created_at", dateStart);
      }

      if (dateEnd) {
        ordersQuery = ordersQuery.lte("created_at", dateEnd);
      }

      const {
        data: orders,
        error: ordersError,
        count: ordersCount,
      } = await ordersQuery;

      if (ordersError) throw ordersError;

      console.log("💰 [CommissionHistory] Orders found:", orders?.length);

      // Get order IDs
      const orderIds = (orders || []).map((o) => o.id);

      if (orderIds.length === 0) {
        setCommissionData([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      // Fetch order items for these orders with pagination
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("id, order_id, price, quantity")
        .in("order_id", orderIds)
        .order("id", { ascending: false })
        .range(from, to);

      if (itemsError) throw itemsError;

      console.log(
        "💰 [CommissionHistory] Order items found:",
        orderItems?.length
      );

      // Map order items with seller info
      const processedData = await Promise.all(
        (orderItems || []).map(async (item: any) => {
          const order = orders?.find((o) => o.id === item.order_id);

          // Fetch seller info
          let sellerName = "Unknown Seller";
          if (order?.seller_id) {
            const { data: seller } = await supabase
              .from("sellers")
              .select("company_name, user_id")
              .eq("seller_id", order.seller_id)
              .single();

            if (seller) {
              sellerName = seller.company_name || "Unknown Seller";

              // Optionally fetch user name if needed
              if (seller.user_id) {
                const { data: user } = await supabase
                  .from("users")
                  .select("full_name, email")
                  .eq("id", seller.user_id)
                  .single();

                if (user) {
                  sellerName =
                    user.full_name ||
                    user.email ||
                    seller.company_name ||
                    "Unknown Seller";
                }
              }
            }
          }

          const orderTotal =
            Number(item.price || 0) * Number(item.quantity || 1);
          const adminCommission = orderTotal * 0.25; // 25%
          const sellerEarning = orderTotal * 0.75; // 75%

          return {
            id: item.id,
            order_id: item.order_id,
            seller_name: sellerName,
            order_total: orderTotal,
            admin_commission: adminCommission,
            seller_earning: sellerEarning,
            created_at: order?.created_at || new Date().toISOString(),
          };
        })
      );

      console.log("💰 [CommissionHistory] Response:", {
        dataCount: processedData.length,
        totalCount: ordersCount,
        sample: processedData[0],
      });

      setCommissionData(processedData);
      setTotalCount(ordersCount || 0);
    } catch (err) {
      console.error("❌ [CommissionHistory] Error fetching commissions:", err);
      setCommissionData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions(currentPage, selectedSeller, startDate, endDate);
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchCommissions(1, selectedSeller, startDate, endDate);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
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
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="">All Sellers</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.shop_name || seller.seller_name || "Unknown"}
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
                    Admin Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Seller Earning
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissionData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No commission records found
                    </td>
                  </tr>
                ) : (
                  commissionData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer">
                        <Plus className="h-4 w-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.admin_commission.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.seller_earning.toFixed(2)}
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

export default CommissionHistory;
