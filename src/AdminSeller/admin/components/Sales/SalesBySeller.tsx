import React, { useState, useEffect } from "react";
import supabase from "../../../../supabase";

interface SellerSales {
  seller_id: string;
  seller_name: string;
  total_orders: number;
  total_quantity: number;
  total_revenue: number;
}

const SalesBySeller: React.FC = () => {
  const [sales, setSales] = useState<SellerSales[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("");

  // --- Fetch sales grouped by seller ---
  const fetchSalesBySeller = async (dateRange?: {
    from?: string;
    to?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Load order_items with seller_product_id
      let query = supabase
        .from("order_items")
        .select("seller_product_id, quantity, price, created_at");

      // Filter using order_items.created_at to avoid orders join dependency
      if (dateRange?.from) query = query.gte("created_at", dateRange.from);
      if (dateRange?.to) query = query.lte("created_at", dateRange.to);

      const { data: items, error: itemsError } = await query;
      if (itemsError) throw itemsError;

      const spIds = Array.from(
        new Set(
          (items || []).map((r: any) => r.seller_product_id).filter(Boolean)
        )
      );

      // 2) Map seller_product_id -> seller_id
      let spIdToSellerId: Record<string, string> = {};
      if (spIds.length) {
        const { data: spRows, error: spErr } = await supabase
          .from("seller_products")
          .select("seller_product_id, seller_id")
          .in("seller_product_id", spIds);
        if (spErr) throw spErr;
        (spRows || []).forEach((r: any) => {
          if (r?.seller_product_id && r?.seller_id) {
            spIdToSellerId[String(r.seller_product_id)] = String(r.seller_id);
          }
        });
      }

      // 3) Load seller names
      const sellerIds = Array.from(new Set(Object.values(spIdToSellerId)));
      const sellerIdToName: Record<string, string> = {};
      if (sellerIds.length) {
        const { data: sellersRows, error: sErr } = await supabase
          .from("sellers")
          .select("seller_id, company_name")
          .in("seller_id", sellerIds);
        if (sErr) throw sErr;
        (sellersRows || []).forEach((s: any) => {
          if (s?.seller_id) {
            sellerIdToName[String(s.seller_id)] =
              s.company_name || `Seller ${s.seller_id}`;
          }
        });
      }

      // 4) Group by seller_id
      const grouped: Record<string, SellerSales> = {};
      for (const row of items || []) {
        const sid = row.seller_product_id
          ? spIdToSellerId[row.seller_product_id]
          : undefined;
        if (!sid) continue; // cannot attribute to a seller without mapping

        if (!grouped[sid]) {
          grouped[sid] = {
            seller_id: sid,
            seller_name: sellerIdToName[sid] || `Seller ${sid}`,
            total_orders: 0,
            total_quantity: 0,
            total_revenue: 0,
          };
        }
        grouped[sid].total_orders += 1;
        grouped[sid].total_quantity += Number(row.quantity || 0);
        grouped[sid].total_revenue +=
          Number(row.price || 0) * Number(row.quantity || 0);
      }

      setSales(Object.values(grouped));
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // --- Filter logic ---
  const applyFilters = () => {
    const now = new Date();
    let from: string | undefined;
    let to: string | undefined = now.toISOString();

    if (dateFilter === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      from = d.toISOString();
    } else if (dateFilter === "month") {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      from = d.toISOString();
    } else if (dateFilter === "3m") {
      const d = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      from = d.toISOString();
    }

    fetchSalesBySeller({ from, to });
  };

  useEffect(() => {
    fetchSalesBySeller();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sales by Seller</h2>

        <div className="flex items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
          >
            <option value="">All Time</option>
            <option value="7d">Last 7 days</option>
            <option value="month">This Month</option>
            <option value="3m">Past 3 Months</option>
          </select>

          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Seller</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Loading sales data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && sales.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              sales.map((s) => (
                <tr
                  key={s.seller_id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {s.seller_name}
                  </td>
                  <td className="py-3 px-4 text-center">{s.total_orders}</td>
                  <td className="py-3 px-4 text-center">{s.total_quantity}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">
                    ${s.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesBySeller;
