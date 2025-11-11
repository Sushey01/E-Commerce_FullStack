import { useState, useEffect } from "react";
// @ts-ignore - supabase is a JS file
import supabase from "../../../supabase";

interface CommissionItem {
  id: string;
  order_id: string;
  seller_name: string;
  product_name: string;
  quantity: number;
  price: number;
  admin_commission: number;
  seller_earning: number;
  date: string;
}

interface Seller {
  seller_id: string;
  company_name: string;
}

interface UseCommissionHistoryResult {
  commissions: CommissionItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  sellers: Seller[];
  fetchCommissions: (page: number, sellerId: string, startDate: string, endDate: string) => Promise<void>;
}

export const useCommissionHistory = (itemsPerPage: number = 10): UseCommissionHistoryResult => {
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Fetch sellers list for dropdown
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from("sellers")
          .select("seller_id, company_name, user_id")
          .eq("status", "approved")
          .order("company_name");

        if (error) throw error;

        setSellers(data || []);
        console.log("💰 [useCommissionHistory] Loaded sellers:", data?.length);
      } catch (err) {
        console.error("❌ [useCommissionHistory] Error fetching sellers:", err);
      }
    };

    fetchSellers();
  }, []);

  const fetchCommissions = async (
    page: number,
    sellerId: string = "all",
    startDate: string = "",
    endDate: string = ""
  ) => {
    setLoading(true);
    setError(null);
    console.log("💰 [useCommissionHistory] Fetching - Page:", page, "Seller:", sellerId, "Dates:", startDate, endDate);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Step 1: Build order_items query
      let orderItemsQuery = supabase
        .from("order_items")
        .select(`
          id,
          order_id,
          product_id,
          quantity,
          price,
          created_at,
          seller_product_id
        `, { count: "exact" })
        .order("created_at", { ascending: false });

      // Apply date filters if provided
      if (startDate) {
        orderItemsQuery = orderItemsQuery.gte("created_at", startDate);
      }
      if (endDate) {
        orderItemsQuery = orderItemsQuery.lte("created_at", endDate);
      }

      const { data: orderItems, error: itemsError, count } = await orderItemsQuery;

      if (itemsError) throw itemsError;

      console.log("💰 [useCommissionHistory] Order items fetched:", orderItems?.length);

      if (!orderItems || orderItems.length === 0) {
        setCommissions([]);
        setTotalCount(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      // Step 2: Filter by seller if needed (using seller_product_id)
      let filteredItems = orderItems;
      if (sellerId && sellerId !== "all") {
        const { data: sellerProducts } = await supabase
          .from("seller_products")
          .select("seller_product_id")
          .eq("seller_id", sellerId);

        const sellerProductIds = sellerProducts?.map((sp: any) => sp.seller_product_id) || [];
        filteredItems = orderItems.filter((item: any) => 
          item.seller_product_id && sellerProductIds.includes(item.seller_product_id)
        );
      }

      // Apply pagination to filtered items
      const paginatedItems = filteredItems.slice(from, Math.min(to + 1, filteredItems.length));

      console.log("💰 [useCommissionHistory] Filtered & paginated:", paginatedItems.length);

      // Step 3: Get seller info for each item
      const processedData: CommissionItem[] = await Promise.all(
        paginatedItems.map(async (item: any) => {
          let sellerName = "Unknown Seller";
          let productName = "Unknown Product";

          // Get seller info via seller_product_id
          if (item.seller_product_id) {
            const { data: sellerProduct } = await supabase
              .from("seller_products")
              .select("seller_id, product_id")
              .eq("seller_product_id", item.seller_product_id)
              .single();

            if (sellerProduct?.seller_id) {
              const { data: seller } = await supabase
                .from("sellers")
                .select("company_name, user_id")
                .eq("seller_id", sellerProduct.seller_id)
                .single();

              if (seller) {
                sellerName = seller.company_name || "Unknown";

                // Optionally get user name
                if (seller.user_id) {
                  const { data: user } = await supabase
                    .from("users")
                    .select("full_name")
                    .eq("id", seller.user_id)
                    .single();

                  if (user?.full_name) {
                    sellerName = user.full_name;
                  }
                }
              }
            }
          }

          // Get product name
          if (item.product_id) {
            const { data: product } = await supabase
              .from("products")
              .select("title")
              .eq("id", item.product_id)
              .single();

            if (product?.title) {
              productName = product.title;
            }
          }

          const totalAmount = Number(item.quantity) * Number(item.price);
          const adminCommission = totalAmount * 0.25; // 25% admin
          const sellerEarning = totalAmount * 0.75; // 75% seller

          return {
            id: item.id,
            order_id: item.order_id,
            seller_name: sellerName,
            product_name: productName,
            quantity: item.quantity,
            price: Number(item.price),
            admin_commission: adminCommission,
            seller_earning: sellerEarning,
            date: new Date(item.created_at).toLocaleDateString(),
          };
        })
      );

      console.log("💰 [useCommissionHistory] Processed:", processedData.length, "items");

      setCommissions(processedData);
      setTotalCount(filteredItems.length);
      setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
    } catch (err: any) {
      console.error("❌ [useCommissionHistory] Error:", err);
      setError(err.message || "Failed to fetch commission history");
      setCommissions([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    commissions,
    loading,
    error,
    totalCount,
    totalPages,
    sellers,
    fetchCommissions,
  };
};
