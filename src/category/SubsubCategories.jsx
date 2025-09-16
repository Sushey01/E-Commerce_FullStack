// SubsubcategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "../components/Spinner";
import FlashSaleSlider from "../components/FlashSaleSlider";

const SubsubcategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subcategoryId = queryParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch subcategory name
      const { data: subData, error: subError } = await supabase
        .from("subcategories")
        .select("name")
        .eq("id", subcategoryId)
        .single();

      if (subError) {
        console.error("Error fetching subcategory:", subError.message);
      } else if (subData) {
        setSubcategoryName(subData.name);
      }

      // Fetch all products under this subcategory
      const { data: productsData, error } = await supabase
        .from("products")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
      } else if (productsData) {
        const transformedProducts = productsData.map((product) => {
          let imageSrc = "/placeholder.jpg";

          if (product.image_url) {
            imageSrc = product.image_url;
          } else if (product.images) {
            try {
              if (
                product.images.trim().startsWith("[") ||
                product.images.trim().startsWith("{")
              ) {
                const parsedImages = JSON.parse(product.images);
                imageSrc = Array.isArray(parsedImages)
                  ? parsedImages[0]
                  : parsedImages;
              } else {
                imageSrc = product.images;
              }
            } catch (e) {
              console.error(
                "Failed to parse images for product",
                product.id,
                e
              );
              imageSrc = product.images || "/placeholder.jpg";
            }
          }

          return {
            id: product.id,
            title: product.title || product.name || "Unnamed Product",
            discount: product.old_price
              ? Math.round(
                  ((product.old_price - product.price) / product.old_price) *
                    100
                )
              : 0,
            image: imageSrc,
            reviews: product.reviews || 0,
            rating: product.rating || 0,
            oldPrice: product.old_price || 0,
            price: product.price || 0,
            sold: product.sold || Math.floor(Math.random() * 100),
            inStock: product.outofstock ? 0 : product.in_stock || 1,
          };
        });

        console.log("Transformed products:", transformedProducts); // Debug log
        setProducts(transformedProducts);
      }

      setLoading(false);
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {subcategoryName ? `Products in ${subcategoryName}` : "Products"}
      </h2>

      {products.length === 0 ? (
        <p>No products found in this subcategory.</p>
      ) : (
        <FlashSaleSlider products={products} />
      )}
    </div>
  );
};

export default SubsubcategoryPage;
