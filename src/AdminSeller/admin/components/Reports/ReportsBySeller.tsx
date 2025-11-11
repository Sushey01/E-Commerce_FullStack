import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import supabase from "../../../../supabase";
import Pagination from "../Pagination";

// Define the data type for the table rows
interface SellerReportItem {
  id: string;
  seller_name: string;
  shop_name: string;
  order_amount: number;
  product_sale_count: number;
  verification_status?: string;
}

const ReportsBySeller = () => {
  const [sellerData, setSellerData] = useState<SellerReportItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // Changed default to "all"
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const toggleExpansion = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Fetch seller reports with pagination
  const fetchSellerReports = async (
    page: number,
    status: string = "approved"
  ) => {
    setLoading(true);
    console.log(
      "🏪 [ReportsBySeller] Fetching sellers - Page:",
      page,
      "Status:",
      status
    );

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // First, check what's in the sellers table at all
      const { data: allSellers, count: totalSellers } = await supabase
        .from("sellers")
        .select("seller_id, user_id, company_name, status", { count: "exact" });

      console.log("🏪 [ReportsBySeller] Total sellers in DB:", totalSellers);
      console.log("🏪 [ReportsBySeller] All sellers:", allSellers);
      console.log("🏪 [ReportsBySeller] Unique status values:", [
        ...new Set(allSellers?.map((s) => s.status)),
      ]);

      // Fetch sellers WITHOUT the foreign key join that's causing the error
      // Correct fields: seller_id, user_id, company_name, status (NOT verification_status or seller_name)
      let query = supabase
        .from("sellers")
        .select("seller_id, user_id, company_name, status", { count: "exact" })
        .order("company_name", { ascending: true })
        .range(from, to);

      // Only filter if status is provided
      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data: sellers, error, count } = await query;

      if (error) throw error;

      console.log("🏪 [ReportsBySeller] Sellers fetched:", sellers?.length);

      // Get user names from users table
      const userIds = sellers?.map((s) => s.user_id).filter(Boolean) || [];
      let userNamesMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);

        users?.forEach((u) => {
          userNamesMap[u.id] = u.full_name || u.email || "Unknown";
        });
      }

      // For each seller, fetch order data from order_items using seller_product_id
      const processedData: SellerReportItem[] = await Promise.all(
        (sellers || []).map(async (seller: any) => {
          console.log(
            `🏪 [ReportsBySeller] Processing seller: ${seller.seller_id} - ${seller.company_name}`
          );

          // Step 1: Get all seller_product_ids for this seller
          const { data: sellerProducts } = await supabase
            .from("seller_products")
            .select("seller_product_id")
            .eq("seller_id", seller.seller_id);

          const sellerProductIds =
            sellerProducts?.map((sp) => sp.seller_product_id) || [];
          console.log(`  📦 Seller has ${sellerProductIds.length} products`);

          let orderAmount = 0;
          let productSaleCount = 0;

          // Step 2: If seller has products, fetch order_items
          if (sellerProductIds.length > 0) {
            const { data: orderItems } = await supabase
              .from("order_items")
              .select("id, quantity, price, seller_product_id")
              .in("seller_product_id", sellerProductIds);

            console.log(`  🛒 Found ${orderItems?.length || 0} order items`);

            // Calculate total amount (quantity * price for each item)
            orderAmount =
              orderItems?.reduce((sum, item) => {
                const itemTotal = Number(item.quantity) * Number(item.price);
                return sum + itemTotal;
              }, 0) || 0;

            productSaleCount = orderItems?.length || 0;

            console.log(
              `  💰 Total: $${orderAmount.toFixed(
                2
              )}, Sales: ${productSaleCount}`
            );
          }

          return {
            id: seller.seller_id,
            seller_name: userNamesMap[seller.user_id] || "Unknown",
            shop_name: seller.company_name || "N/A",
            order_amount: orderAmount,
            product_sale_count: productSaleCount,
            verification_status: seller.status,
          };
        })
      );

      console.log("🏪 [ReportsBySeller] Response:", {
        dataCount: processedData.length,
        totalCount: count,
        sample: processedData[0],
      });

      setSellerData(processedData);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("❌ [ReportsBySeller] Error fetching seller reports:", err);
      setSellerData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerReports(currentPage, selectedStatus);
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchSellerReports(1, selectedStatus);
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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/5">
                    Seller Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Order Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellerData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No sellers found
                    </td>
                  </tr>
                ) : (
                  sellerData.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpansion(item.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                          {expandedId === item.id ? (
                            <Minus className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.seller_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          $
                          {item.order_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>

                      {expandedId === item.id && (
                        <>
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
                              {item.shop_name}
                            </td>
                          </tr>
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
                              {item.product_sale_count}
                            </td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
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
              label="sellers"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReportsBySeller;
