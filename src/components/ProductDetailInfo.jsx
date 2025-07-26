import React, { useState } from "react";

const ProductDetailInfo = () => {
  const [capacity, setCapacity] = useState("512 GB");
  const [color, setColor] = useState("red");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-md shadow-sm">
      {/* Product Info */}
      <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
        Apple MacBook Pro 16.2" with Liquid Retina XDR Display, M2 Max Chip with 12–Core CPU
      </h1>

      <div className="flex items-center mt-3">
        <div className="text-yellow-400 text-lg">★★★★★</div>
        <p className="ml-2 text-gray-500 text-sm">25 Review</p>
      </div>

      <div className="mt-4 text-xl font-bold text-black">
        Rs.2,50,000{" "}
        <span className="line-through text-gray-400 text-base ml-2">Rs.2,50,000</span>
      </div>

      {/* Style Options */}
      <div className="mt-6">
        <p className="font-medium text-sm text-gray-700 mb-1">Style: Apple M1 Max Chip</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className="px-3 py-2 border rounded bg-gray-100 text-sm"
            >
              Apple M1 Max Chip
            </button>
          ))}
        </div>
      </div>

      {/* Capacity Options */}
      <div className="mt-6">
        <p className="font-medium text-sm text-gray-700 mb-1">Capacity: {capacity}</p>
        <div className="flex gap-2">
          {["512 GB", "1 TB"].map((size) => (
            <button
              key={size}
              onClick={() => setCapacity(size)}
              className={`px-3 py-2 border rounded ${
                capacity === size ? "bg-black text-white" : "bg-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mt-6">
        <p className="font-medium text-sm text-gray-700 mb-1">Color</p>
        <div className="flex gap-4">
          <button
            onClick={() => setColor("red")}
            className={`w-6 h-6 rounded-full border-2 ${
              color === "red" ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: "#f87171" }}
          />
          <button
            onClick={() => setColor("orange")}
            className={`w-6 h-6 rounded-full border-2 ${
              color === "orange" ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: "#fbbf24" }}
          />
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mt-6">
        <p className="font-medium text-sm text-gray-700 mb-1">Quantity</p>
        <div className="flex items-center border rounded w-max px-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-lg px-2"
          >
            -
          </button>
          <span className="px-3">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-lg px-2"
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
