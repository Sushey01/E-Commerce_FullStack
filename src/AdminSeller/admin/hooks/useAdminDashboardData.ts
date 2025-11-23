import { useState, useEffect, useRef } from "react";
import supabase from "../../../supabase";

export interface DashboardStats {
  totalCustomers: number;
  totalCategories: number;
  totalBrands: number;
  totalProducts: number;
  sellerProducts: number;
  totalOrders: number;
  confirmedOrders: number;
  processedOrders: number;
  pendingOrders: number;
  totalSales: number;
  topBrands: any[];
  topCategories: any[];
  topSellers: any[];
  topProducts: any[];
  recentOrders: any[];
  salesThisMonth: number;
  averageRating: number;
  totalSellers: number;
  activeSellers: number;
  inactiveSellers: number;
  pendingSellerRequests: number;
}

export function useAdminDashboardData(activeTab: string) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    async function fetchDashboardStats() {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      console.log("fetchDashboardStats: start");
      setLoadingStats(true);
      try {
        // Fetch all main stats in parallel
        const [
          customers,
          categories,
          brands,
          products,
          sellerProducts,
          sellers,
          activeSellers,
          inactiveSellers,
          pendingSellerRequests,
          orders,
        ] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "customer"),
          // For categories and brands we need both count and data for top lists
          supabase.from("categories").select("id, name", { count: "exact" }),
          supabase.from("brands").select("brand_id, brand_name", { count: "exact" }),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("seller_products").select("seller_product_id", { count: "exact", head: true }),
          supabase.from("sellers").select("seller_id", { count: "exact", head: true }),
          supabase.from("sellers").select("seller_id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("sellers").select("seller_id", { count: "exact", head: true }).eq("status", "inactive"),
          supabase.from("sellers").select("seller_id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("orders").select("id, status, total, created_at", { count: "exact" }),
        ]);
        console.log("customers", customers);
        console.log("categories", categories);
        console.log("brands", brands);
        console.log("products", products);
        console.log("sellerProducts", sellerProducts);
        console.log("sellers", sellers);
        console.log("activeSellers", activeSellers);
        console.log("inactiveSellers", inactiveSellers);
        console.log("pendingSellerRequests", pendingSellerRequests);
        console.log("orders", orders);

        // Aggregate order stats
        const ordersData = orders.data || [];
        const totalOrders = orders.count || 0;
        const confirmedOrders = ordersData.filter((o: any) => o.status === "Confirmed").length;
        const processedOrders = ordersData.filter((o: any) => o.status === "Processed").length;
        const pendingOrders = ordersData.filter((o: any) => o.status === "Pending").length;
        const totalSales = ordersData.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

        // Top brands and categories (first 5)
        const topBrands = brands && brands.data ? brands.data.slice(0, 5) : [];
        const topCategories = categories && categories.data ? categories.data.slice(0, 5) : [];

        // Compute sales aggregation from order_items for paid orders to get real sold counts and revenue
        let topSellers: any[] = [];
        let topProductsAgg: any[] = [];
        try {
          // Get paid orders (paid_amount > 0) to consider completed sales
          const { data: paidOrders } = await supabase.from("orders").select("id, paid_amount, status, created_at").gt("paid_amount", 0).order("created_at", { ascending: false }).limit(5000);
          const paidOrderIds = (paidOrders || []).map((o: any) => o.id);
          console.log("paidOrders count:", (paidOrders || []).length);
          if (paidOrderIds.length > 0) {
            const { data: orderItems } = await supabase
              .from("order_items")
              .select("order_id, product_id, seller_product_id, price, quantity")
              .in("order_id", paidOrderIds);
            const items = orderItems || [];
            console.log("orderItems fetched:", items.length);

            // Map seller_product_id -> seller_id
            const sellerProductIds = Array.from(new Set(items.map((it: any) => it.seller_product_id).filter(Boolean)));
            let sellerMapByProduct = new Map<string, string>();
            if (sellerProductIds.length > 0) {
              const { data: sellerProductsMap } = await supabase
                .from("seller_products")
                .select("seller_product_id, seller_id")
                .in("seller_product_id", sellerProductIds);
              (sellerProductsMap || []).forEach((sp: any) => sellerMapByProduct.set(sp.seller_product_id, sp.seller_id));
            }

            // Aggregate per seller and per product
            const sellerAgg = new Map<string, { quantity: number; revenue: number }>();
            const productAgg = new Map<string, { quantity: number; revenue: number }>();

            items.forEach((it: any) => {
              const qty = Number(it.quantity) || 0;
              const price = Number(it.price) || 0;
              const revenue = qty * price;

              // product aggregation (use product_id if present)
              const pid = it.product_id || null;
              if (pid) {
                const prev = productAgg.get(pid) || { quantity: 0, revenue: 0 };
                prev.quantity += qty;
                prev.revenue += revenue;
                productAgg.set(pid, prev);
              }

              // seller aggregation via seller_product_id -> seller_id
              const spid = it.seller_product_id || null;
              const sid = spid ? sellerMapByProduct.get(spid) : null;
              if (sid) {
                const prev = sellerAgg.get(sid) || { quantity: 0, revenue: 0 };
                prev.quantity += qty;
                prev.revenue += revenue;
                sellerAgg.set(sid, prev);
              }
            });

            // Build top sellers list
            const sellerIds = Array.from(sellerAgg.keys()).slice(0);
            console.log("sellerAgg size:", sellerAgg.size);
            if (sellerIds.length > 0) {
              const { data: sellersData } = await supabase
                .from("sellers")
                .select("seller_id,company_name")
                .in("seller_id", sellerIds);
              const sellerNameMap = new Map<string, string>();
              (sellersData || []).forEach((s: any) => sellerNameMap.set(s.seller_id, s.company_name));

              topSellers = Array.from(sellerAgg.entries())
                .map(([seller_id, agg]) => ({ seller_id, company_name: sellerNameMap.get(seller_id) || "Unknown", totalSales: agg.quantity, totalRevenue: agg.revenue }))
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 5);
              console.log("topSellers computed:", topSellers);
            }

            // Build top products list
            const productIds = Array.from(productAgg.keys()).slice(0);
            if (productIds.length > 0) {
              const { data: productsData } = await supabase
                .from("products")
                .select("id,title,price")
                .in("id", productIds);
              const productMap = new Map<string, any>();
              (productsData || []).forEach((p: any) => productMap.set(p.id, p));

              topProductsAgg = Array.from(productAgg.entries())
                .map(([product_id, agg]) => ({ product_id, products: productMap.get(product_id) || {}, totalQuantity: agg.quantity, price: (productMap.get(product_id)?.price) ?? (agg.revenue / (agg.quantity || 1)) }))
                .sort((a, b) => b.totalQuantity - a.totalQuantity)
                .slice(0, 6);
              console.log("topProductsAgg computed:", topProductsAgg);
            }
          }
        } catch (err) {
          console.error("Error aggregating sales data:", err);
        }

        // Bulk fetch and join for recent orders seller info
        const recentOrdersRaw = ordersData.slice(0, 5);
        const orderIds = recentOrdersRaw.map(o => o.id);
        // Fetch all order_items for these orders
        const { data: allOrderItems } = await supabase
          .from("order_items")
          .select("order_id,seller_product_id")
          .in("order_id", orderIds);
        console.log("allOrderItems", allOrderItems);
        // Get all seller_product_ids
        const sellerProductIds = (allOrderItems || []).map(oi => oi.seller_product_id);
        // Fetch all seller_products for these seller_product_ids
        const { data: allSellerProducts } = await supabase
          .from("seller_products")
          .select("seller_product_id,seller_id")
          .in("seller_product_id", sellerProductIds);
        console.log("allSellerProducts", allSellerProducts);
        // Get all seller_ids
        const sellerIds = (allSellerProducts || []).map(sp => sp.seller_id);
        // Fetch all sellers for these seller_ids
        const { data: allSellers } = await supabase
          .from("sellers")
          .select("seller_id,company_name")
          .in("seller_id", sellerIds);
        console.log("allSellers", allSellers);

        // Build lookup maps
        const sellerProductMap = new Map();
        (allSellerProducts || []).forEach(sp => sellerProductMap.set(sp.seller_product_id, sp.seller_id));
        const sellerMap = new Map();
        (allSellers || []).forEach(s => sellerMap.set(s.seller_id, s.company_name));

        // Attach seller_name to each order
        const recentOrders = recentOrdersRaw.map(order => {
          let sellerName = "Unknown Seller";
          const orderItem = (allOrderItems || []).find(oi => oi.order_id === order.id);
          if (orderItem && orderItem.seller_product_id) {
            const sellerId = sellerProductMap.get(orderItem.seller_product_id);
            if (sellerId) {
              const companyName = sellerMap.get(sellerId);
              if (companyName) sellerName = companyName;
            }
          }
          return { ...order, seller_name: sellerName };
        });

        setDashboardStats({
          totalCustomers: customers.count || 0,
          totalCategories: categories.count || 0,
          totalBrands: brands.count || 0,
          totalProducts: products.count || 0,
          sellerProducts: sellerProducts.count || 0,
          totalOrders,
          confirmedOrders,
          processedOrders,
          pendingOrders,
          totalSales,
          topBrands,
          topCategories,
          topSellers: topSellers,
          topProducts: topProductsAgg || [], // populated from order_items aggregation
          recentOrders,
          salesThisMonth: totalSales, // Simplified
          averageRating: 0, // Add logic if you have ratings
          totalSellers: sellers.count || 0,
          activeSellers: activeSellers.count || 0,
          inactiveSellers: inactiveSellers.count || 0,
          pendingSellerRequests: pendingSellerRequests.count || 0,
        });
        setLoadingStats(false);
        console.log("fetchDashboardStats: finished");
        // allow future fetches
        fetchingRef.current = false;
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        alert("Dashboard fetch error: " + error);
        fetchingRef.current = false;
      }
    }
    if (activeTab === "dashboard") fetchDashboardStats();
    return () => { fetchingRef.current = false; };
  }, [activeTab]);

  return { dashboardStats, loadingStats };
}
