import { useCallback, useState } from "react";
import supabase from "../../../supabase";

export type UISeller = {
    id: string;
    name: string;
    company?: string;
    email?: string;
    products?: number;
    sales?: number;
    status?: string;
};

export default function useSellers() {
    const [sellers, setSellers] = useState<UISeller[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchSellers = useCallback(async (page = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            // 1) Fetch sellers minimal fields (schema: seller_id, user_id, company_name, status)
            const { data, error: selErr, count } = await supabase
                .from("sellers")
                .select("seller_id, user_id, company_name, status", { count: "exact" })
                .order("company_name", { ascending: true })
                .range(from, to);

            if (selErr) throw new Error(selErr.message);

            const sellersRows = data || [];

            // 2) Resolve names from users table
            const userIds: string[] = Array.from(
                new Set(sellersRows.map((r: any) => r.user_id).filter(Boolean))
            );
            let usersMap: Record<string, { full_name?: string; email?: string }> = {};
            if (userIds.length) {
                const { data: users, error: usrErr } = await supabase
                    .from("users")
                    .select("id, full_name, email")
                    .in("id", userIds);
                if (usrErr) throw new Error(usrErr.message);
                usersMap = (users || []).reduce((acc: any, u: any) => {
                    acc[u.id] = { full_name: u.full_name, email: u.email };
                    return acc;
                }, {} as Record<string, { full_name?: string; email?: string }>);
            }

            // 3) Map into UI shape
            const rows: UISeller[] = sellersRows.map((r: any) => {
                const user = usersMap[r.user_id] || {};
                const name = user.full_name || user.email || r.company_name || r.seller_id;
                return {
                    id: String(r.seller_id),
                    name,
                    company: r.company_name || "",
                    email: user.email || "",
                    products: 0,
                    sales: 0,
                    status: r.status || "inactive",
                };
            });

            // 4) Compute products count per seller
            const sellerIds: string[] = rows.map((r) => r.id);
            let productsCountMap: Record<string, number> = {};
            let sellerProdMap: Record<string, string> = {};
            if (sellerIds.length) {
                const { data: sps, error: spErr } = await supabase
                    .from("seller_products")
                    .select("seller_product_id, seller_id")
                    .in("seller_id", sellerIds);
                if (spErr) throw new Error(spErr.message);
                productsCountMap = (sps || []).reduce((acc: any, sp: any) => {
                    const sid = String(sp.seller_id);
                    acc[sid] = (acc[sid] || 0) + 1;
                    sellerProdMap[String(sp.seller_product_id)] = sid;
                    return acc;
                }, {} as Record<string, number>);
            }

            // 5) Compute sales total per seller from paid orders' items
            let salesMap: Record<string, number> = {};
            try {
                const { data: paidOrders, error: paidErr } = await supabase
                    .from("orders")
                    .select("id")
                    .gt("paid_amount", 0)
                    .order("created_at", { ascending: false })
                    .limit(5000);
                if (paidErr) throw paidErr;
                const paidIds = (paidOrders || []).map((o: any) => o.id);
                if (paidIds.length) {
                    const { data: items, error: itemsErr } = await supabase
                        .from("order_items")
                        .select("order_id, seller_product_id, price, quantity")
                        .in("order_id", paidIds);
                    if (itemsErr) throw itemsErr;
                    for (const it of items || []) {
                        const sid = sellerProdMap[String(it.seller_product_id)];
                        if (!sid) continue;
                        const add = Number(it.price || 0) * Number(it.quantity || 0);
                        salesMap[sid] = (salesMap[sid] || 0) + add;
                    }
                }
            } catch (e) {
                // Non-fatal: if this aggregation fails, we still show sellers
                console.warn("Sales aggregation failed:", (e as any)?.message ?? e);
            }

            // 6) Attach aggregates
            rows.forEach((r) => {
                r.products = productsCountMap[r.id] || 0;
                r.sales = Number((salesMap[r.id] || 0).toFixed(2));
            });

            setSellers(rows);
            setTotalCount(count || rows.length);
        } catch (e: any) {
            setError(e.message || "Failed to load sellers");
            setSellers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { sellers, loading, error, totalCount, fetchSellers };
}