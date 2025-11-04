import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

export type OrderItemRow = {
  order_id: string;
  quantity: number;
  price: number | string;
  orders?: { id: string; status: string; created_at: string } | null;
  product?: { id: string; title: string } | null;
  sp?: { seller_id: number | string | null } | null;
};

export type OrderSummary = {
  order_id: string;
  created_at: string;
  status: string;
  total_amount: number;
  total_items: number;
};

export type SellerSales = {
  seller_id: string | number;
  seller_name?: string | null;
  total_revenue: number;
  total_orders: number; // unique orders count
};

export default function useAdminSales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [overallOrders, setOverallOrders] = useState<OrderSummary[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<OrderSummary[]>([]);
  const [salesBySeller, setSalesBySeller] = useState<SellerSales[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pull order items joined with orders (for status/date), products (for title if needed), and seller_products (to get seller_id)
      const { data, error } = await supabase
        .from("order_items")
        .select(
          `order_id, quantity, price, orders:orders(id,status,created_at), product:products(id,title), sp:seller_products(seller_id)`
        );
      if (error) throw error;

      const rows: OrderItemRow[] = (data as any[]) || [];

      // Group by order
      const orderMap = new Map<string, OrderSummary>();
      const orderIds: string[] = [];
      for (const r of rows) {
        const id = r.order_id;
        if (!orderMap.has(id)) {
          orderMap.set(id, {
            order_id: id,
            created_at: r.orders?.created_at ?? new Date().toISOString(),
            status: r.orders?.status ?? "unknown",
            total_amount: 0,
            total_items: 0,
          });
          orderIds.push(id);
        }
        const os = orderMap.get(id)!;
        const lineAmount = Number(r.price ?? 0) * Number(r.quantity ?? 0);
        os.total_amount += isFinite(lineAmount) ? lineAmount : 0;
        os.total_items += Number(r.quantity ?? 0);
      }

      const summaries = Array.from(orderMap.values()).sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1
      );

      // Determine unpaid using payments table when available
      let paidSet = new Set<string>();
      if (orderIds.length > 0) {
        const { data: pays } = await supabase
          .from("payments")
          .select("order_id,status")
          .in("order_id", orderIds);
        for (const p of (pays as any[]) || []) {
          if (String(p.status).toLowerCase() === "paid") {
            paidSet.add(p.order_id);
          }
        }
      }

      const unpaid = summaries.filter(
        (o) => !paidSet.has(o.order_id) && o.status.toLowerCase() !== "paid"
      );

      // Aggregate by seller
      const sellerAgg = new Map<string | number, { revenue: number; orders: Set<string> }>();
      for (const r of rows) {
        const sid = (r.sp?.seller_id ?? null) as any;
        if (sid === null || sid === undefined) continue;
        if (!sellerAgg.has(sid)) sellerAgg.set(sid, { revenue: 0, orders: new Set() });
        const acc = sellerAgg.get(sid)!;
        acc.revenue += Number(r.price ?? 0) * Number(r.quantity ?? 0);
        acc.orders.add(r.order_id);
      }

      // Resolve seller names for those IDs
      const sellerIds = Array.from(sellerAgg.keys());
      let sellerNameMap = new Map<string | number, string>();
      if (sellerIds.length > 0) {
        const { data: srows } = await supabase
          .from("sellers")
          .select("seller_id, company_name")
          .in("seller_id", sellerIds as any);
        for (const s of (srows as any[]) || []) {
          sellerNameMap.set(s.seller_id, s.company_name);
        }
      }

      const sellerList: SellerSales[] = sellerIds.map((sid) => {
        const acc = sellerAgg.get(sid)!;
        return {
          seller_id: sid,
          seller_name: sellerNameMap.get(sid) ?? null,
          total_revenue: Number(acc.revenue.toFixed(2)),
          total_orders: acc.orders.size,
        };
      });

      setOverallOrders(summaries);
      setUnpaidOrders(unpaid);
      setSalesBySeller(sellerList);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, error, overallOrders, unpaidOrders, salesBySeller, refresh };
}
