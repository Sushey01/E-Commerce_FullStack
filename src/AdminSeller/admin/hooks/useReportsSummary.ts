import { useEffect, useMemo, useState } from "react";
import supabase from "../../../supabase";

export type BarDatum = { name: string; value: number };

type Summary = {
    totalSalesAlltime: number;
    payoutsTotal: number;
    totalCategories: number;
    totalBrands: number;
    monthlySales: number[]; // length <= 12 (latest first)
    monthlyBars: BarDatum[]; // last 12 months with names
    payoutBars: BarDatum[]; // last 12 months of paid payouts
    categoryBars: BarDatum[]; // top-N categories by product count
    brandBars: BarDatum[]; // top-N brands by product count
};

const MONTHS_BACK = 12;

export default function useReportsSummary() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<Summary>({
        totalSalesAlltime: 0,
        payoutsTotal: 0,
        totalCategories: 0,
        totalBrands: 0,
        monthlySales: [],
        monthlyBars: [],
        payoutBars: [],
        categoryBars: [],
        brandBars: [],
    });

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                // Categories and brands (counts and names) - fetch all columns to robustly pick a display name later
                const [
                    { count: catCount, data: cats },
                    { count: brandCount, data: brs },
                ] = await Promise.all([
                    supabase.from("categories").select("*", { count: "exact" }),
                    supabase.from("brands").select("*", { count: "exact" }),
                ]);

                // Pull order items with order created_at (for monthly aggregation)
                const { data: items } = await supabase
                    .from("order_items")
                    .select(
                        `order_id, quantity, price, orders:orders(id,created_at,status)`
                    );

                let totalSalesAlltime = 0;
                const buckets = new Map<string, number>();
                const now = new Date();
                for (const r of (items as any[]) || []) {
                    const lineAmount = Number(r.price ?? 0) * Number(r.quantity ?? 0);
                    totalSalesAlltime += isFinite(lineAmount) ? lineAmount : 0;
                    const created = new Date(r?.orders?.created_at || now);
                    const key = `${created.getFullYear()}-${String(
                        created.getMonth() + 1
                    ).padStart(2, "0")}`;
                    buckets.set(key, (buckets.get(key) || 0) + lineAmount);
                }

                // Build last N months series (oldest -> newest)
                const series: number[] = [];
                for (let i = MONTHS_BACK - 1; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                        2,
                        "0"
                    )}`;
                    series.push(Number((buckets.get(key) || 0).toFixed(2)));
                }

                // Payouts (best effort): monthly buckets and total where status='paid'
                let payoutsTotal = 0;
                const payoutBuckets = new Map<string, number>();
                try {
                    const { data: payments } = await supabase
                        .from("payments")
                        .select("amount,status,created_at");
                    for (const p of (payments as any[]) || []) {
                        if (String(p.status || "").toLowerCase() === "paid") {
                            const amt = Number(p.amount || 0);
                            payoutsTotal += amt;
                            const created = new Date(p.created_at || now);
                            const key = `${created.getFullYear()}-${String(
                                created.getMonth() + 1
                            ).padStart(2, "0")}`;
                            payoutBuckets.set(key, (payoutBuckets.get(key) || 0) + amt);
                        }
                    }
                } catch {
                    // ignore if payments table not present
                }

                // Build named monthly bars for sales and payouts (oldest -> newest)
                const monthFmt = new Intl.DateTimeFormat(undefined, { month: "short" });
                const monthlyBars: { name: string; value: number }[] = [];
                const payoutBars: { name: string; value: number }[] = [];
                for (let i = MONTHS_BACK - 1; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                        2,
                        "0"
                    )}`;
                    monthlyBars.push({ name: monthFmt.format(d), value: buckets.get(key) || 0 });
                    payoutBars.push({ name: monthFmt.format(d), value: payoutBuckets.get(key) || 0 });
                }

                // Category/Brand bar data (top-N by product count)
                const categoryBars: BarDatum[] = [];
                const brandBars: BarDatum[] = [];
                try {
                    const { data: products } = await supabase
                        .from("products")
                        .select("category_id, brand_id");

                    // Build lookup maps: ID -> name
                    // Categories: id is string, name field
                    const catNameById = new Map<string, string>();
                    for (const c of (cats as any[]) || []) {
                        const id = String(c.id || "");
                        const name = String(c.name || c.title || c.label || `Category ${id}`).trim();
                        if (id) catNameById.set(id, name);
                    }

                    // Brands: brand_id is number, brand_name field
                    const brNameById = new Map<number, string>();
                    for (const b of (brs as any[]) || []) {
                        const id = Number(b.brand_id);
                        const name = String(b.brand_name || b.name || b.title || `Brand ${id}`).trim();
                        if (!Number.isNaN(id)) brNameById.set(id, name);
                    }

                    // Count products by category and brand
                    const catCountByName = new Map<string, number>();
                    const brCountByName = new Map<string, number>();

                    for (const p of (products as any[]) || []) {
                        // Category: string ID
                        const catId = String(p.category_id || "").trim();
                        if (catId) {
                            const catName = catNameById.get(catId) || `Category ${catId}`;
                            catCountByName.set(catName, (catCountByName.get(catName) || 0) + 1);
                        }

                        // Brand: number ID
                        const brandId = Number(p.brand_id);
                        if (!Number.isNaN(brandId)) {
                            const brandName = brNameById.get(brandId) || `Brand ${brandId}`;
                            brCountByName.set(brandName, (brCountByName.get(brandName) || 0) + 1);
                        }
                    }

                    const catArr: BarDatum[] = Array.from(catCountByName.entries()).map(
                        ([name, value]) => ({ name, value })
                    );
                    const brArr: BarDatum[] = Array.from(brCountByName.entries()).map(
                        ([name, value]) => ({ name, value })
                    );

                    catArr.sort((a, b) => b.value - a.value);
                    brArr.sort((a, b) => b.value - a.value);
                    categoryBars.push(...catArr.slice(0, 8));
                    brandBars.push(...brArr.slice(0, 8));
                } catch (err) {
                    console.error("Error fetching product counts:", err);
                    // if products table missing, leave as empty arrays
                }

                setSummary({
                    totalSalesAlltime: Number(totalSalesAlltime.toFixed(2)),
                    payoutsTotal: Number(payoutsTotal.toFixed(2)),
                    totalCategories: catCount || 0,
                    totalBrands: brandCount || 0,
                    monthlySales: series,
                    monthlyBars,
                    payoutBars,
                    categoryBars,
                    brandBars,
                });
            } catch (e: any) {
                setError(e.message || String(e));
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    return { ...summary, loading, error };
}
