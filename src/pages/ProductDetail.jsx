// import React from "react";
// import ProductDetailPhoto from "../components/ProductDetailPhoto";
// import ProductDetailInfo from "../components/ProductDetailInfo";
// import mockProduct from "../data/mockData";
// import { useParams } from "react-router-dom";
// import mockProducts from "../data/mockData";
// import products from "../data/products";

// const ProductDetail = () => {

//   const {id} = useParams(); // get id from URL

//   // find the product that matches the id
//   const product = products.find((item)=>item.id===id);
//   // console.log(product,'ssshkjhskjhskjh')

//   if (!product) {
//     return <p>Product not found!</p>
//   }

//   return (
//     <div className="bg-gray-50 p-[16px] py-1">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-md shadow-sm">
//         {/* Left: Product Image */}
// <ProductDetailPhoto images={[product.image]} outOfStock={product.outOfStock} />

//         {/* Right: Product Info */}
//         <ProductDetailInfo product = {product} />
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailPhoto from "../components/ProductDetailPhoto";
import ProductDetailInfo from "../components/ProductDetailInfo";
import supabase from "../supabase";

const ProductDetail = () => {
  const { id } = useParams(); // from /product/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    console.log("useParams id:", id);

    const fetchProduct = async () => {
      setLoading(true);

      // ✅ If Supabase uses UUIDs, this will still work
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id.toString()) // force string compare
        .maybeSingle(); // avoids crashing if not found
        console.log("Fetching product for ID:", id, "=>", data);


      if (error) {
        console.error("Error fetching product detail:", error);
        setProduct(null);
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn("No product found for id:", id);
        setProduct(null);
        setLoading(false);
        return;
      }

      console.log("Fetched product detail:", data);

      // normalize
      let images = [];
      if (Array.isArray(data.images)) {
        images = data.images;
      } else if (typeof data.images === "string") {
        try {
          images = JSON.parse(data.images);
        } catch {
          images = [];
        }
      }

      const mapped = {
        id: data.id,
        title: data.title || "Untitled Product",
        title1: data.title ? data.title.split(" ")[0] : "Product",
        title2: data.title ? data.title.split(" ").slice(1).join(" ") : "",
        subtitle: data.subtitle || "No subtitle",
        description: data.description || "",
        price: Number(data.price) || 0,
        oldPrice: Number(data.old_price) || 0,
        reviews: data.reviews || 0,
        rating: Number(data.rating) || 0,
        outOfStock: data.outofstock || false,
        image:
          images.length > 0 ? images[0] : "https://via.placeholder.com/300",
        images,
        variant:
          data.variant && typeof data.variant === "object" ? data.variant : {},
      };

      setProduct(mapped);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found!</p>;

  return (
    <div className="bg-gray-50 p-[16px] py-1">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-md shadow-sm">
        <ProductDetailPhoto
          images={product.images}
          outOfStock={product.outOfStock}
        />
        <ProductDetailInfo product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;


