import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

export type AdminProduct = {
  // from products
  id: string; // product_id (uuid)
  name: string;
  category?: string | null; // category name for display
  category_id?: string | null; // raw id when needed
  image?: string | null; // primary image url if available

  // from seller_products (seller-specific)
  seller_product_id: number;
  product_id: string; // uuid
  seller_id?: string | number | null; // bigint in DB
  price: number; // numeric(10,2)
  stock: number; // seller stock
  min_order_qty?: number | null;
  status?: string | null;

  // from sellers
  seller?: string | null; // company_name
};

export default function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (sellerId?: string | number) => {
    setLoading(true);
    setError(null);
    try {
      // Pull from seller_products to include seller info and product fields
      let query = supabase
        .from("seller_products")
        .select(
          // fetch product core fields; we'll resolve category names client-side to avoid FK alias issues
          "seller_product_id, seller_id, product_id, price, stock, min_order_qty, status, product:products(id,title,category_id,images), seller:sellers(seller_id,company_name)"
        );

      if (sellerId) query = query.eq("seller_id", sellerId);

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data as any[] | null) || [];

      // collect distinct category_ids
      const categoryIds = Array.from(
        new Set(
          rows
            .map((r) => r?.product?.category_id)
            .filter((id: any) => typeof id === "string" && id.length > 0)
        )
      ) as string[];

      // build a map id -> name
      let catMap = new Map<string, string>();
      if (categoryIds.length > 0) {
        const { data: cats, error: catErr } = await supabase
          .from("categories")
          .select("id,name")
          .in("id", categoryIds);
        if (!catErr && cats) {
          for (const c of cats as any[]) {
            if (c?.id && c?.name) catMap.set(c.id, c.name);
          }
        }
      }

      // map rows to AdminProduct
      const mapped: AdminProduct[] = rows.map((row) => {
        // parse primary image from products.images (json string or array or plain string)
        let primaryImage: string | null = null;
        const imgs = row.product?.images;
        try {
          if (Array.isArray(imgs) && imgs.length > 0) {
            primaryImage = imgs[0] ?? null;
          } else if (typeof imgs === "string" && imgs.length > 0) {
            if (imgs.trim().startsWith("[")) {
              const arr = JSON.parse(imgs);
              primaryImage = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
            } else if (imgs.startsWith("http")) {
              primaryImage = imgs;
            }
          }
        } catch {}

        const cid = row.product?.category_id ?? null;
        return {
          // product
          id: row.product?.id,
          name: row.product?.title,
          category: cid ? catMap.get(cid) ?? null : null,
          category_id: cid,
          image: primaryImage,

          // seller_products
          seller_product_id: Number(row.seller_product_id),
          product_id: row.product_id,
          seller_id: row.seller_id ?? null,
          price: Number(row.price ?? 0),
          stock: Number(row.stock ?? 0),
          min_order_qty: row.min_order_qty ?? null,
          status: row.status ?? null,

          // seller
          seller: row.seller?.company_name ?? null,
        } as AdminProduct;
      });

      setProducts(mapped.filter((p) => !!p.id));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // default: load all seller-product associations
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts };
}
