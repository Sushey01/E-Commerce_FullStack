import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductCard = ({ type, isLoading }) => {
  if (isLoading) return <ProductCardSkeleton type={type} />;

  switch (type) {
    case "feature":
      return (
        <div className="p-4 border rounded shadow max-w-sm mx-auto animate-pulse">
          <div className="w-full h-48 bg-gray-300 rounded"></div>
          <div className="mt-2 h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="mt-1 h-4 bg-gray-300 rounded w-full"></div>
          <div className="mt-3 h-10 bg-gray-300 rounded w-full"></div>
        </div>
      );

    case "monthly":
      return (
        <div className="p-3 py-2 bg-[#f7f7f7] border rounded max-w-sm mx-auto animate-pulse">
          <div className="relative mb-3">
            <div className="absolute top-0 left-0 bg-gray-300 rounded-3xl px-6 py-2"></div>
            <div className="w-full h-40 bg-gray-300 rounded"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-2/3 mx-auto"></div>
          <div className="w-full mt-3 h-9 bg-gray-300 rounded-full"></div>
        </div>
      );

    case "laptop":
      return (
        <div className="p-4 border rounded shadow max-w-sm mx-auto animate-pulse">
          <div className="w-full h-44 bg-gray-300 rounded"></div>
          <div className="mt-2 h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="mt-1 h-4 bg-gray-300 rounded w-full"></div>
          <div className="mt-1 h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="mt-3 h-10 bg-gray-300 rounded w-full"></div>
        </div>
      );

    default:
      return <div className="animate-pulse">Loading...</div>;
  }
};

export default ProductCard;
