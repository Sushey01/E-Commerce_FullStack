import React, { useState } from "react";
import { FaTrash, FaHeart, FaStore } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      seller: "Emommcerce Bazar",
      title: "Hair Trimming Vintage T9 Electric Hair Clipper Hair Cutting Machine Professional",
      details: "Eyewear size: One size ‖ Frame Color: Black",
      warranty: "No Warranty",
      price: 437,
      quantity: 1,
      image: "https://via.placeholder.com/80x80.png?text=Product+Image",
    },
    {
      id: 2,
      seller: "Emommcerce Bazar",
      title: "Hair Trimming Vintage T9 Electric Hair Clipper Hair Cutting Machine Professional",
      details: "Eyewear size: One size ‖ Frame Color: Black",
      warranty: "No Warranty",
      price: 437,
      quantity: 1,
      image: "https://via.placeholder.com/80x80.png?text=Product+Image",
    },
  ]);

  const handleDelete = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-2">My Cart</h2>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <button className="bg-gray-100 text-black px-4 py-1 rounded-full flex items-center gap-2">
          🗂️ Select All ({cartItems.length})
        </button>
        <button className="bg-black text-white px-4 py-1 rounded-full flex items-center gap-2">
          Delete All <BsTrash />
        </button>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-gray-100 mb-4 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          {/* Seller Header */}
          <div className="w-full mb-2 flex items-center gap-2 text-xl font-semibold">
            <FaStore /> {item.seller}
          </div>

          {/* Product Content */}
          <div className="flex gap-4 w-full">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.details}</p>
              <p className="text-gray-500 text-sm">{item.warranty}</p>
            </div>

            {/* Price & Qty */}
            <div className="flex flex-col items-end justify-between">
              <div className="flex gap-6 text-lg font-semibold text-gray-700">
                <span>Rs.{item.price}</span>
                <span>Qty: {item.quantity.toString().padStart(2, "0")}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  className="text-red-600 bg-red-100 p-2 rounded-full"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </button>
                <button className="bg-gray-200 p-2 rounded-full">
                  <FaHeart />
                </button>
              </div>

              {/* Qty control */}
              <div className="flex border border-orange-500 rounded overflow-hidden mt-2">
                <button
                  className="px-3 py-1 font-bold"
                  onClick={() => handleQuantityChange(item.id, +1)}
                >
                  +
                </button>
                <span className="px-3 py-1 bg-white">{item.quantity}</span>
                <button
                  className="px-3 py-1 font-bold"
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
