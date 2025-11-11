import { useState, useEffect } from "react";
// @ts-ignore - supabase is a JS file
import supabase from "../../../supabase";

interface ProductStockItem {
  id: number;
  product_name: string;
  category: string;
  stock: number;
}

interface UseProductStockResult {
  products: ProductStockItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  categories: string[];
  fetchProducts: (page: number, categoryFilter: string) => Promise<void>;
}

export const useProductStock = (itemsPerPage: number = 10): UseProductStockResult => {
  const [products, setProducts] = useState<ProductStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (error) throw error;
        
        const categoryNames = data?.map((cat: any) => cat.name) || [];
        setCategories(categoryNames);
      } catch (err) {
        console.error("📦 [useProductStock] Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async (page: number, categoryFilter: string = "all") => {
    setLoading(true);
    setError(null);
    console.log("📦 [useProductStock] Fetching - Page:", page, "Category:", categoryFilter);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Query seller_products (which has stock) with join to products (which has title)
      let query = supabase
        .from("seller_products")
        .select(`
          seller_product_id,
          stock,
          product:products(id, title, category_id)
        `, { count: "exact" })
        .order("stock", { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log("📦 [useProductStock] Raw data:", data?.length, "items");

      // Transform nested data to flat structure
      const transformedData: ProductStockItem[] = await Promise.all(
        (data || []).map(async (item: any) => {
          let categoryName = "Unknown";

          // Fetch category name if category_id exists
          if (item.product?.category_id) {
            const { data: categoryData } = await supabase
              .from("categories")
              .select("name")
              .eq("id", item.product.category_id)
              .single();

            if (categoryData?.name) {
              categoryName = categoryData.name;
            }
          }

          return {
            id: item.seller_product_id,
            product_name: item.product?.title || "Unknown Product",
            category: categoryName,
            stock: item.stock || 0,
          };
        })
      );

      // Filter by category if needed
      let filteredData = transformedData;
      if (categoryFilter && categoryFilter !== "all") {
        filteredData = transformedData.filter(
          (product) => product.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      console.log("📦 [useProductStock] Transformed:", filteredData.length, "items");

      setProducts(filteredData);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (err: any) {
      console.error("❌ [useProductStock] Error:", err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    categories,
    fetchProducts,
  };
};
