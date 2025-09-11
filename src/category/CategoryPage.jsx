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
  const categorySlug = queryParams.get("id"); // ?id=laptops

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (categorySlug) {
        query = query.eq("category_slug", categorySlug); // ✅ filter by slug
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
        setProducts([]);
      } else {
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.title,
          discount: product.old_price
            ? Math.round(
                ((product.old_price - product.price) / product.old_price) * 100
              )
            : 0,
          image: product.images?.[0] || "/placeholder.png",
          reviews: product.reviews || 0,
          rating: product.rating || 0,
          oldPrice: product.old_price || 0,
          price: product.price,
          sold: product.sold || 0,
          inStock: product.stock || (!product.outofstock ? 1 : 0),
        }));
        setProducts(transformedProducts);

        // Optional: prettify category name for heading
        setCategoryName(categorySlug.replace(/-/g, " "));
      }

      setLoading(false);
    };

    fetchProducts();
  }, [categorySlug]);

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
