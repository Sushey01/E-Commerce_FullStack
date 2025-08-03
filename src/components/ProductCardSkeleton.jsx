import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductCard = ({ type, isLoading, ...props }) => {
  if (isLoading) return <ProductCardSkeleton type={type} />;

  switch (type) {
    case "feature":
      return (
        <div className="p-4 border rounded shadow max-w-sm mx-auto hover:shadow-lg">
          <img src={props.image} alt={props.title} className="w-full h-48 object-cover rounded" />
          <h3 className="mt-2 font-semibold">{props.title}</h3>
          <p className="text-sm text-gray-600">{props.description}</p>
          <button className="mt-3 bg-[#0296a0] text-white w-full py-2 rounded hover:bg-[#027a85]">Shop Now</button>
        </div>
      );

    case "monthly":
      return (
        <div className="p-3 py-2 bg-[#f7f7f7] border rounded max-w-sm mx-auto hover:shadow">
          <div className="relative mb-3">
            <div className="absolute top-0 left-0 bg-red-600 rounded-3xl px-3 py-1 text-white text-xs">{props.discount}</div>
            <img src={props.image} alt={props.title} className="w-full rounded" />
          </div>
          <p className="font-semibold text-center">{props.title}</p>
          {/* Add more details here as you want, e.g., rating, prices */}
          <button className="w-full mt-3 text-[#0296a0] border rounded-full py-1.5 hover:bg-[#0296a0] hover:text-white transition">
            {props.label || "Shop Now"}
          </button>
        </div>
      );

    case "laptop":
      return (
        <div className="p-4 border rounded shadow max-w-sm mx-auto hover:shadow-lg">
          <img src={props.image} alt={props.title} className="w-full h-44 object-cover rounded" />
          <h3 className="mt-2 font-semibold">{props.title}</h3>
          <p className="text-sm text-gray-600">{props.specs}</p>
          <p className="mt-1 font-bold text-green-600">{props.price}</p>
          <button className="mt-3 bg-[#0296a0] text-white w-full py-2 rounded hover:bg-[#027a85]">Shop Now</button>
        </div>
      );

    default:
      return <div>Unknown product type</div>;
  }
};

export default ProductCard;
