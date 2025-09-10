import React from "react";
import HoverAddCartWishShare from "./HoverAddCartWishShare";
import { useDispatch } from "react-redux";
import { addToCartlist } from "../features/cartlistSlice";

const MonthlySaleCard = ({
  id,
  discount,
  image,
  title,
  reviews,
  rating,
  oldPrice,
  price,
  sold,
  inStock,
  onAddToCart = () => {},
  label,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const item = { id, title, price, image, quantity: 1 };
    dispatch(addToCartlist(item));
    onAddToCart(item);
  };

  return (
    <div className="relative p-3 py-2 group cursor-pointer bg-[#f7f7f7] border rounded-md hover:shadow w-full h-full">
      {/* Discount Badge */}
      <div className="flex relative justify-center items-center mb-3">
        {discount > 0 && (
          <div className="absolute top-0 left-0 border rounded-3xl bg-red-600 p-1.5 text-white">
            <p className="text-[10px] md:text-sm">-{discount}%</p>
          </div>
        )}
        <img src={image} alt={title} className="w-[75%] rounded" />
      </div>

      {/* Title */}
      <p className="text-sm md:text-lg font-semibold mb-1 text-center line-clamp-1">
        {title}
      </p>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-3 w-3 ${
              i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.898 1.468 8.296L12 18.896 4.596 23.5l1.468-8.296L0 9.306l8.332-1.151z" />
          </svg>
        ))}
        <span className="text-[10px] md:text-sm text-gray-600">{reviews}</span>
      </div>

      {/* Price */}
      <div className="mb-2 flex gap-2 justify-center">
        {oldPrice > 0 && (
          <p className="text-[7px] md:text-xs text-gray-400 line-through">
            ${oldPrice}
          </p>
        )}
        <p className="text-[10px] md:text-sm font-bold text-green-600">
          ${price}
        </p>
      </div>

      {/* Stock Info */}
      <div className="items-center justify-center gap-3 mb-2 hidden md:flex">
        <p className="text-xs md:text-sm text-gray-600">Sold: {sold}</p>
        <p className="text-xs md:text-sm text-gray-800">In Stock: {inStock || 0}</p>
      </div>

      {/* Add to Cart */}
      <button
        className="w-full text-[#0296a0] text-xs md:text-sm p-1.5 border rounded-full md:group-hover:bg-[#0296a0] md:group-hover:text-white transition"
        onClick={handleAddToCart}
      >
        {label}
      </button>

      {/* Hover actions */}
      <div className="absolute hidden group-hover:flex transition-transform duration-500 md:right-3 right-0 top-0">
        <HoverAddCartWishShare
          product={{ id, title, price, image }}
          onShare={() => console.log("Share clicked")}
        />
      </div>
    </div>
  );
};

export default MonthlySaleCard;
