import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

export type OrderItemRow = {
    order_id: string; // uuid in DB
    product_id: string; // text in DB
    quantity: number;
    price: number;
    product?: { id: string; title: string } | null;
};

export default function useOrders() {
    const [orders, setOrders] = useState<OrderItemRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const fetchOrders = useCallback(
        async (page: number = 1) => {
            setLoading(true);
            setError(null);
            setCurrentPage(page);
            try {
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;

                // First try: join product title (if FK is configured)
                const first = await supabase
                    .from("order_items")
                    .select(
                        "order_id, product_id, quantity, price, products(id,title)",
                        { count: "exact" }
                    )
                    .order("order_id", { ascending: true })
                    .range(from, to);

                let rows: any[] = [];
                let total = 0;

                let hasJoin = true;
                if (first.error) {
                    hasJoin = false;
                    // Fallback: base fields only (no join)
                    const fallback = await supabase
                        .from("order_items")
                        .select("order_id, product_id, quantity, price", { count: "exact" })
                        .order("order_id", { ascending: true })
                        .range(from, to);

                    if (fallback.error) throw fallback.error;
                    rows = (fallback.data as any[]) || [];
                    total = fallback.count || 0;
                } else {
                    rows = (first.data as any[]) || [];
                    total = first.count || 0;
                }

                // If join isn't available, resolve product titles in a second query
                let productMap: Record<string, { id: string; title: string }> = {};
                if (!hasJoin && rows.length) {
                    const ids = Array.from(new Set(rows.map((r) => String(r.product_id)).filter(Boolean)));
                    if (ids.length) {
                        // Try match against products.id (uuid)
                        try {
                            const { data: pById } = await supabase
                                .from("products")
                                .select("id,title")
                                .in("id", ids);
                            if (Array.isArray(pById)) {
                                for (const p of pById) {
                                    productMap[String(p.id)] = { id: String(p.id), title: String(p.title) };
                                }
                            }
                        } catch {}
                        // Try match against products.product_id (text/SKU)
                        try {
                            const { data: pByProdId } = await supabase
                                .from("products")
                                .select("product_id,title")
                                .in("product_id", ids);
                            if (Array.isArray(pByProdId)) {
                                for (const p of pByProdId) {
                                    if (p && p.product_id != null) {
                                        productMap[String(p.product_id)] = { id: String(p.product_id), title: String(p.title) };
                                    }
                                }
                            }
                        } catch {}
                        // Try match against products.sku (alternate naming)
                        try {
                            const { data: pBySku } = await supabase
                                .from("products")
                                .select("sku,title")
                                .in("sku", ids);
                            if (Array.isArray(pBySku)) {
                                for (const p of pBySku) {
                                    if (p && p.sku != null) {
                                        productMap[String(p.sku)] = { id: String(p.sku), title: String(p.title) };
                                    }
                                }
                            }
                        } catch {}
                    }
                }

                const normalized: OrderItemRow[] = rows.map((r) => ({
                    order_id: String(r.order_id),
                    product_id: String(r.product_id),
                    quantity: r.quantity,
                    price: r.price,
                    product: Array.isArray(r.products)
                        ? r.products?.[0]
                            ? { id: String(r.products[0].id), title: String(r.products[0].title) }
                            : null
                        : r.products
                        ? { id: String(r.products.id), title: String(r.products.title) }
                        : r.product // backward compatibility if alias used elsewhere
                        ? Array.isArray(r.product)
                            ? r.product?.[0]
                                ? { id: String(r.product[0].id), title: String(r.product[0].title) }
                                : null
                            : { id: String(r.product.id), title: String(r.product.title) }
                        : productMap[String(r.product_id)]
                        ? productMap[String(r.product_id)]
                        : null,
                }));
                setOrders(normalized);
                setTotalCount(total);
            } catch (err: any) {
                setError(err.message || String(err));
            } finally {
                setLoading(false);
            }
        },
        [pageSize]
    );

    useEffect(() => {
        fetchOrders(1);
    }, [fetchOrders]);

    const deleteOrderItem = useCallback(async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from("order_items")
                .delete()
                .eq("order_id", orderId);
            if (error) throw error;
            // optimistically update local state
            setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
            setTotalCount((prev) => Math.max(0, prev - 1));
        } catch (err: any) {
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        orders,
        loading,
        error,
        totalCount,
        currentPage,
        pageSize,
        fetchOrders,
        deleteOrderItem,
    };
}