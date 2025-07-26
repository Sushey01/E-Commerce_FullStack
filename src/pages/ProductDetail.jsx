import React from "react";
import ProductDetailPhoto from "../components/ProductDetailPhoto";
import ProductDetailInfo from "../components/ProductDetailInfo";

const ProductDetail = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-4 md:p-8 rounded-md shadow-sm">
        {/* Left: Product Image */}
        <ProductDetailPhoto />

        {/* Right: Product Info */}
        <ProductDetailInfo />
      </div>
    </div>
  );
};

export default ProductDetail;
