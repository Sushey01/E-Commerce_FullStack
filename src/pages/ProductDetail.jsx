import React from "react";
import ProductDetailPhoto from "../components/ProductDetailPhoto";
import ProductDetailInfo from "../components/ProductDetailInfo";
import mockProduct from "../data/mockData";

const ProductDetail = () => {
  return (
    <div className="bg-gray-50 p-[16px] py-1">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-md shadow-sm">
        {/* Left: Product Image */}
        <ProductDetailPhoto images={mockProduct.images} outOfStock={mockProduct.outOfStock} />

        {/* Right: Product Info */}
        <ProductDetailInfo {...mockProduct} />
      </div>
    </div>
  );
};

export default ProductDetail;
