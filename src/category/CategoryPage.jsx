import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "./Spinner";
import FlashSaleSlider from "./FlashSaleSlider";

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id"); // UUID

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!categoryId) {
        setLoading(false);
        return;
      }

      // 1️⃣ Fetch products for this category
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error(productsError);
        setProducts([]);
      } else {
        const transformedProducts = productsData.map((p) => ({
          id: p.id,
          title: p.title,
          discount: p.old_price
            ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
            : 0,
          image: p.images?.[0] || "/placeholder.png",
          reviews: p.reviews || 0,
          rating: p.rating || 0,
          oldPrice: p.old_price || 0,
          price: p.price,
          sold: p.sold || 0,
          inStock: p.stock || (!p.outofstock ? 1 : 0),
        }));
        setProducts(transformedProducts);
      }

      // 2️⃣ Fetch category name
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single();

      if (!categoryError && categoryData) setCategoryName(categoryData.name);

      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {categoryName ? `Products in ${categoryName}` : "All Products"}
      </h2>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <FlashSaleSlider products={products} />
      )}
    </div>
  );
};

export default CategoryPage;
