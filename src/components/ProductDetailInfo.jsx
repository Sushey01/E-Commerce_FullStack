import React, { useState } from "react";

const formatPrice = (price) =>
  typeof price === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    : price;

const ProductDetailInfo = ({
  style = [],
  name = "",
  description = "",
  capacity = [],
  colors = [],
  reviews = 0,
  price,
  oldPrice,
}) => {
  const [selectedStyle, setSelectedStyle] = useState(style[0] || "");
  const [selectedCapacity, setSelectedCapacity] = useState(capacity[0] || "");
  const [color, setColor] = useState(colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-md shadow-sm">
      {/* Product Info */}
      <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
        {name} {description}
      </h1>

      <div className="flex items-center mt-3">
        <div className="text-yellow-400 text-lg">★★★★★</div>
        <p className="ml-2 text-gray-500 text-sm">{reviews} Reviews</p>
      </div>

      <div className="mt-4 text-xl font-bold text-black">
        {formatPrice(price)}
        {oldPrice && (
          <span className="line-through text-gray-400 text-base ml-2">
            {formatPrice(oldPrice)}
          </span>
        )}
      </div>

      {/* Style Options */}
      {Array.isArray(style) && style.length > 0 && (
        <div className="mt-6">
          <p className="font-medium text-sm text-gray-700 mb-1">Style</p>
          <div className="flex flex-wrap gap-2">
            {style.map((chip, index) => (
              <button
                key={index}
                onClick={() => setSelectedStyle(chip)}
                className={`px-3 py-2 border rounded text-sm ${
                  selectedStyle === chip
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Capacity Options */}
      {Array.isArray(capacity) && capacity.length > 0 && (
        <div className="mt-6">
          <p className="font-medium text-sm text-gray-700 mb-1">
            Capacity: {selectedCapacity}
          </p>
          <div className="flex gap-2">
            {capacity.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedCapacity(size)}
                className={`px-3 py-2 border rounded ${
                  selectedCapacity === size ? "bg-black text-white" : "bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {Array.isArray(colors) && colors.length > 0 && (
        <div className="mt-6">
          <p className="font-medium text-sm text-gray-700 mb-1">Color: {color}</p>
          <div className="flex gap-4">
            {colors.map((col, idx) => (
              <button
                key={idx}
                onClick={() => setColor(col)}
                aria-label={`Color ${col}`}
                title={`Color ${col}`}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === col ? "border-black" : "border-gray-300"
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mt-6">
        <p className="font-medium text-sm text-gray-700 mb-1">Quantity</p>
        <div className="flex items-center border rounded w-max px-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-lg px-2"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-3">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-lg px-2"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded text-sm">
          Buy Now
        </button>
        <button className="flex items-center justify-center gap-2 border border-teal-600 text-teal-600 px-6 py-2 rounded text-sm hover:bg-teal-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.4A1 1 0 007 20h10a1 1 0 001-.8L20 13M7 13H5.4"
            />
          </svg>
          Add to Cart
        </button>
      </div>

      {/* Return Policies */}
      <ul className="mt-6 list-disc list-inside text-gray-700 text-sm space-y-1">
        <li>Free delivery today</li>
        <li>100% money back Guarantee</li>
        <li>7 days product return policy</li>
      </ul>
    </div>
  );
};

export default ProductDetailInfo;
