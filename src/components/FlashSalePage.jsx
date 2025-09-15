import React, { useState, useEffect } from "react";
import FlashSaleSlider from "./FlashSaleSlider";
import supabase from "../supabase";
import Spinner from "./Spinner";

const FlashSalePage = ({ products: initialProducts, title }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

useEffect(() => {
  if (!initialProducts) {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
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
          sold: product.sold || Math.floor(Math.random() * 100), // Random 0-99
          inStock: product.outofstock || (!product.outofStock ? 1 : 0),
        }));
        setProducts(transformedProducts);
      }
      setLoading(false);
    };
    fetchProducts();
  }
}, [initialProducts]);

  return (
    <div>
      {/* Header */}
      <div className="w-full px-3 py-2 flex justify-between items-center">
        <p className="text-[#777777] text-xl md:text-2xl">{title}</p>
        <button className="flex gap-2 items-center">
          <p className="text-[#0296a0] text-sm underline decoration-[#0296a0]">
            Shop Now
          </p>
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <div className="w-full box-border overflow-hidden relative">
          <FlashSaleSlider products={products} />
        </div>
      )}
    </div>
  );
};

export default FlashSalePage;
