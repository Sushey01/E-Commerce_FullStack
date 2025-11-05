import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

export type OrderItemRow = {
    order_id: string; // uuid in DB
    product_id: string; // text in DB
    seller_product_id?: string | null; // link to seller_products
    quantity: number;
    price: number;
    product?: { id: string; title: string } | null;
    // Enriched from orders join
    order?: {
        id: string;
        status: string | null;
        payment_method: string | null;
        total: number | null;
        created_at: string | null;
        user_id: string | null;
        delivered_at?: string | null;
        cancelled_at?: string | null;
        paid_amount?: number | null;
    } | null;
    // Enriched via seller_products -> sellers
    sellerName?: string | null;
    // Enriched via users table using orders.user_id
    customerName?: string | null;
};

export type OrderFilters = {
    dateFrom?: string; // ISO string
    dateTo?: string;   // ISO string
    paymentStatus?: string;
    deliveryStatus?: string;
    paymentMethod?: string;
    searchCode?: string; // order code search
};

export default function useOrders() {
    const [orders, setOrders] = useState<OrderItemRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [lastFilters, setLastFilters] = useState<OrderFilters | undefined>(
        undefined
    );

    const fetchOrders = useCallback(
        async (page: number = 1, filters?: OrderFilters) => {
            setLoading(true);
            setError(null);
            setCurrentPage(page);
            try {
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;

                const appliedFilters = filters ?? lastFilters;
                setLastFilters(appliedFilters);
                // Always include orders join to enrich details (safe if relationship exists)
                const requiresOrdersJoin = true;

                const baseSelect = "order_id, product_id, seller_product_id, quantity, price, created_at";
                const productsJoin = ", products(id,title)";
                // Use inner join for orders when filtering by orders.* fields
                const ordersJoin = ", orders!inner(id,status,payment_method,total,created_at,user_id,delivered_at,cancelled_at,paid_amount)";

                async function runWithQuery(includeOrders: boolean, includeProducts: boolean) {
                    let query = supabase
                        .from("order_items")
                        .select(
                            (baseSelect + (includeProducts ? productsJoin : "") + (includeOrders ? ordersJoin : "")) as any,
                            { count: "exact" }
                        )
                        .order("order_id", { ascending: true })
                        .range(from, to);

                    // Apply filters
                    if (includeOrders) {
                        if (appliedFilters?.dateFrom) {
                            query = query.gte("orders.created_at", appliedFilters.dateFrom);
                        }
                        if (appliedFilters?.dateTo) {
                            query = query.lte("orders.created_at", appliedFilters.dateTo);
                        }
                        if (appliedFilters?.paymentStatus) {
                            // Interpret Paid/Unpaid using orders.paid_amount
                            const ps = appliedFilters.paymentStatus.toLowerCase();
                            if (ps === "paid") {
                                query = query.gt("orders.paid_amount", 0);
                            } else if (ps === "unpaid") {
                                query = query.eq("orders.paid_amount", 0);
                            }
                        }
                        if (appliedFilters?.deliveryStatus) {
                            // Derive delivery from timestamps
                            const ds = appliedFilters.deliveryStatus.toLowerCase();
                            if (ds === "delivered") {
                                query = query.not("orders.delivered_at", "is", null);
                            } else if (ds === "cancelled") {
                                query = query.not("orders.cancelled_at", "is", null);
                            }
                        }
                        if (appliedFilters?.paymentMethod) {
                            query = query.eq(
                                "orders.payment_method",
                                appliedFilters.paymentMethod
                            );
                        }
                    } else {
                        // Fallback: apply date filters against order_items if orders not joined
                        if (appliedFilters?.dateFrom) {
                            query = query.gte("created_at", appliedFilters.dateFrom);
                        }
                        if (appliedFilters?.dateTo) {
                            query = query.lte("created_at", appliedFilters.dateTo);
                        }
                    }
                    // Search by order_id (uuid as text)
                    if (appliedFilters?.searchCode) {
                        query = query.ilike("order_id", `%${appliedFilters.searchCode}%`);
                    }

                    const res = await query;
                    return res;
                }

                let rows: any[] = [];
                let total = 0;
                let hasProductsJoin = true;

                // Try with products join (and orders join if required)
                const first = await runWithQuery(requiresOrdersJoin, true);
                if (first.error) {
                    // Retry without products join, keep orders join if needed
                    const second = await runWithQuery(requiresOrdersJoin, false);
                    if (second.error) {
                        // Final fallback: no joins
                        const fallback = await runWithQuery(false, false);
                        if (fallback.error) throw fallback.error;
                        rows = (fallback.data as any[]) || [];
                        total = fallback.count || 0;
                        hasProductsJoin = false;
                    } else {
                        rows = (second.data as any[]) || [];
                        total = second.count || 0;
                        hasProductsJoin = false;
                    }
                } else {
                    rows = (first.data as any[]) || [];
                    total = first.count || 0;
                    hasProductsJoin = true;
                }

                // If join isn't available, resolve product titles in a second query
                let productMap: Record<string, { id: string; title: string }> = {};
                if (!hasProductsJoin && rows.length) {
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
                    seller_product_id: r.seller_product_id ?? null,
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
                    order: r.orders
                        ? Array.isArray(r.orders)
                            ? r.orders[0]
                                ? {
                                      id: String(r.orders[0].id),
                                      status: r.orders[0].status ?? null,
                                      payment_method: r.orders[0].payment_method ?? null,
                                      total: r.orders[0].total ?? null,
                                      created_at: r.orders[0].created_at ?? null,
                                      user_id: r.orders[0].user_id ?? null,
                                      delivered_at: r.orders[0].delivered_at ?? null,
                                      cancelled_at: r.orders[0].cancelled_at ?? null,
                                      paid_amount: r.orders[0].paid_amount ?? null,
                                  }
                                : null
                            : {
                                  id: String(r.orders.id),
                                  status: r.orders.status ?? null,
                                  payment_method: r.orders.payment_method ?? null,
                                  total: r.orders.total ?? null,
                                  created_at: r.orders.created_at ?? null,
                                  user_id: r.orders.user_id ?? null,
                                  delivered_at: r.orders.delivered_at ?? null,
                                  cancelled_at: r.orders.cancelled_at ?? null,
                                  paid_amount: r.orders.paid_amount ?? null,
                              }
                        : null,
                }));

                // Enrich seller name if seller_product_id present
                const sellerProductIds = Array.from(
                    new Set(
                        normalized
                            .map((n) => n.seller_product_id)
                            .filter((v): v is string => Boolean(v))
                    )
                );
                if (sellerProductIds.length) {
                    try {
                        const { data: spRows } = await supabase
                            .from("seller_products")
                            .select("seller_product_id, seller_id")
                            .in("seller_product_id", sellerProductIds);

                        const spIdToSellerId: Record<string, string> = {};
                        (spRows || []).forEach((r: any) => {
                            if (r?.seller_product_id && r?.seller_id) {
                                spIdToSellerId[String(r.seller_product_id)] = String(r.seller_id);
                            }
                        });

                        const sellerIds = Array.from(new Set(Object.values(spIdToSellerId)));
                        if (sellerIds.length) {
                            const { data: sellersRows } = await supabase
                                .from("sellers")
                                .select("seller_id, company_name")
                                .in("seller_id", sellerIds);
                            const sellerIdToName: Record<string, string> = {};
                            (sellersRows || []).forEach((s: any) => {
                                if (s?.seller_id) {
                                    sellerIdToName[String(s.seller_id)] = s.company_name || `Seller ${s.seller_id}`;
                                }
                            });

                            // attach sellerName to rows
                            normalized.forEach((n) => {
                                const sid = n.seller_product_id ? spIdToSellerId[n.seller_product_id] : undefined;
                                if (sid && sellerIdToName[sid]) {
                                    n.sellerName = sellerIdToName[sid];
                                }
                            });
                        }
                    } catch {}
                }

                // Enrich customer full_name via users table
                const userIds = Array.from(
                    new Set(
                        normalized
                            .map((n) => n.order?.user_id)
                            .filter((v): v is string => Boolean(v))
                    )
                );
                if (userIds.length) {
                    try {
                        const { data: userRows } = await supabase
                            .from("users")
                            .select("id, full_name, email")
                            .in("id", userIds);
                        const userIdToName: Record<string, string> = {};
                        (userRows || []).forEach((u: any) => {
                            if (u?.id) {
                                userIdToName[String(u.id)] = u.full_name || u.email || `User ${u.id}`;
                            }
                        });
                        normalized.forEach((n) => {
                            const uid = n.order?.user_id ?? undefined;
                            if (uid && userIdToName[uid]) {
                                n.customerName = userIdToName[uid];
                            }
                        });
                    } catch {}
                }
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