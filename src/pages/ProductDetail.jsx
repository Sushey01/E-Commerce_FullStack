import React from "react";
import ProductDetailPhoto from "../components/ProductDetailPhoto";
import ProductDetailInfo from "../components/ProductDetailInfo";
import mockProduct from "../data/mockData";
import { useParams } from "react-router-dom";
import mockProducts from "../data/mockData";
import featureProducts from "../DummySection/Data";
import products from "../data/products";

const ProductDetail = () => {

  const {id} = useParams(); // get id from URL

  // find the product that matches the id
  const product = products.find((item)=>item.id===id);
  // console.log(product,'ssshkjhskjhskjh')

  if (!product) {
    return <p>Product not found!</p>
  }

  return (
    <div className="bg-gray-50 p-[16px] py-1">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-md shadow-sm">
        {/* Left: Product Image */}
<ProductDetailPhoto images={[product.image]} outOfStock={product.outOfStock} />

        {/* Right: Product Info */}
        <ProductDetailInfo product = {product} />
      </div>
    </div>
  );
};

export default ProductDetail;
