import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To get query params
import supabase from "../supabase";
import Spinner from "./Spinner";
import FlashSaleSlider from "./FlashSaleSlider"; // Reuse your slider or create a grid

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id"); // Get category_id from URL (e.g., ?id=b65d9fd7-...)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      // Filter based on hierarchy
      if (categoryId) {
        // Assuming "Laptops" is a subcategory; adjust if it's category_id or subsubcategory_id
        query = query.eq("subcategory_id", categoryId); // e.g., for Laptops subcategory
        // If broad category: query.eq('category_id', categoryId)
        // For subsub: query.eq('subsubcategory_id', categoryId)
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        // Transform data (reuse your logic)
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.title,
          discount: product.old_price
            ? Math.round(
                ((product.old_price - product.price) / product.old_price) * 100
              )
            : 0,
          image: product.images[0],
          reviews: product.reviews || 0,
          rating: product.rating || 0,
          oldPrice: product.old_price || 0,
          price: product.price,
          sold: product.sold || 0,
          inStock: product.stock || (!product.outofstock ? 1 : 0), // Assuming you added stock
        }));
        setProducts(transformedProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId]); // Re-fetch if category changes

  return (
    <div>
      <h2>Products in Category</h2>{" "}
      {/* Dynamically set title based on category */}
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <FlashSaleSlider products={products} /> // Or a custom grid
      )}
    </div>
  );
};

export default CategoryPage;
