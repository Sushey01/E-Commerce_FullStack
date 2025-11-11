import { useState, useEffect } from "react";
// @ts-ignore - supabase is a JS file
import supabase from "../../../supabase";

interface SellerReportItem {
  id: string;
  seller_name: string;
  shop_name: string;
  order_amount: number;
  product_sale_count: number;
  verification_status?: string;
}

interface UseReportsBySellerResult {
  sellers: SellerReportItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  allSellers: any[];
  uniqueStatuses: string[];
  fetchSellerReports: (page: number, status: string) => Promise<void>;
}

export const useReportsBySeller = (itemsPerPage: number = 10): UseReportsBySellerResult => {
  const [sellers, setSellers] = useState<SellerReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [allSellers, setAllSellers] = useState<any[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);

  const fetchSellerReports = async (page: number, status: string = "all") => {
    setLoading(true);
    setError(null);
    console.log("🏪 [useReportsBySeller] Fetching - Page:", page, "Status:", status);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // First, check what's in the sellers table
      const { data: allSellersData, count: totalSellers } = await supabase
        .from("sellers")
        .select("seller_id, user_id, company_name, status", { count: "exact" });

      console.log("🏪 [useReportsBySeller] Total sellers in DB:", totalSellers);
      setAllSellers(allSellersData || []);
      
      const statuses = [...new Set(allSellersData?.map((s: any) => s.status))];
      setUniqueStatuses(statuses as string[]);
      console.log("🏪 [useReportsBySeller] Unique status values:", statuses);

      // Build query with optional status filter
      let query = supabase
        .from("sellers")
        .select("seller_id, user_id, company_name, status", { count: "exact" })
        .order("company_name", { ascending: true })
        .range(from, to);

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data: sellersData, error: sellersError, count } = await query;

      if (sellersError) throw sellersError;

      console.log("🏪 [useReportsBySeller] Sellers fetched:", sellersData?.length || 0);

      if (!sellersData || sellersData.length === 0) {
        console.log("🏪 [useReportsBySeller] No sellers found");
        setSellers([]);
        setTotalCount(count || 0);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
        setLoading(false);
        return;
      }

      // Get user names from users table
      const userIds = sellersData.map((s: any) => s.user_id).filter(Boolean);
      let userNamesMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);

        users?.forEach((u: any) => {
          userNamesMap[u.id] = u.full_name || u.email || "Unknown";
        });
      }

      // For each seller, fetch order data from order_items using seller_product_id
      const processedData: SellerReportItem[] = await Promise.all(
        sellersData.map(async (seller: any) => {
          console.log(`🏪 Processing: ${seller.seller_id} - ${seller.company_name}`);

          // Step 1: Get all seller_product_ids for this seller
          const { data: sellerProducts } = await supabase
            .from("seller_products")
            .select("seller_product_id")
            .eq("seller_id", seller.seller_id);

          const sellerProductIds = sellerProducts?.map((sp: any) => sp.seller_product_id) || [];
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

            // Calculate total amount (quantity * price)
            orderAmount = orderItems?.reduce((sum: number, item: any) => {
              return sum + (Number(item.quantity) * Number(item.price));
            }, 0) || 0;

            productSaleCount = orderItems?.length || 0;

            console.log(`  💰 Total: $${orderAmount.toFixed(2)}, Sales: ${productSaleCount}`);
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

      console.log("🏪 [useReportsBySeller] Processed:", processedData.length, "sellers");

      setSellers(processedData);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (err: any) {
      console.error("❌ [useReportsBySeller] Error:", err);
      setError(err.message || "Failed to fetch seller reports");
      setSellers([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    sellers,
    loading,
    error,
    totalCount,
    totalPages,
    allSellers,
    uniqueStatuses,
    fetchSellerReports,
  };
};
