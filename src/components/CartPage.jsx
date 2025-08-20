import React, { useState } from "react";
import { FaTrash, FaHeart, FaStore } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import Sunglass from "../assets/images/sunglass.webp";

const CartPage = () => {

  const data = localStorage.getItem('cartlist');
  const [cartItems, setCartItems] = useState(JSON.parse(data))

  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     seller: "Emommcerce Bazar",
  //     title: "Hair Trimming Vintage T9 Electric Hair Clipper Hair Cutting Machine Professional",
  //     details: "Eyewear size: One size ‖ Frame Color: Black",
  //     warranty: "No Warranty",
  //     price: 437,
  //     quantity: 1,
  //     image: Sunglass,
  //   },
  //   {
  //     id: 2,
  //     seller: "Gadget Mart",
  //     title: "Wireless Earbuds with Charging Case - Black Edition",
  //     details: "Bluetooth 5.3 ‖ Battery: 20hrs",
  //     warranty: "6 Months Warranty",
  //     price: 899,
  //     quantity: 2,
  //     image: Sunglass,
  //   },
  //   {
  //     id: 3,
  //     seller: "Emommcerce Bazar",
  //     title: "T9 Electric Hair Clipper – Limited Edition",
  //     details: "Eyewear size: One size ‖ Frame Color: Black",
  //     warranty: "No Warranty",
  //     price: 437,
  //     quantity: 1,
  //     image: Sunglass,
  //   },
  // ]);

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

  // Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.seller]) acc[item.seller] = [];
    acc[item.seller].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">🛒 My Cart</h2>

      <div className="flex justify-between items-center mb-6">
        <button className="bg-gray-100 text-black px-4 py-1 rounded-full flex items-center gap-2 text-sm">
          🗂️ Select All ({cartItems.length})
        </button>
        <button className="bg-black text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm">
          Delete All <BsTrash />
        </button>
      </div>

      {/* Render grouped items */}
      {Object.entries(groupedItems).map(([seller, items]) => (
        <div key={seller} className="mb-8">
          {/* Seller title */}
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
            <FaStore className="text-gray-700" /> {seller}
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 rounded-lg p-4 flex flex-row gap-4 items-start md:items-center justify-between mb-4"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* Product Info */}
              <div className="flex-1 space-y-1">
                <p className="text-base font-semibold leading-snug line-clamp-2">{item.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{item.details}</p>
                <p className="text-sm text-gray-500">{item.warranty}</p>
              </div>

              {/* Right Side: Price, Qty, Actions */}
              <div className="flex flex-col gap-3 items-end min-w-[150px]">
                <div className="text-lg font-bold text-gray-800">Rs.{item.price}</div>
                <div className="text-sm font-medium text-gray-600">
                  Qty: {item.quantity.toString().padStart(2, "0")}
                </div>

                <div className="flex border border-orange-500 rounded overflow-hidden text-sm">
                  <button
                    className="px-3 py-1 font-bold"
                                        onClick={() => handleQuantityChange(item.id, -1)}

                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-white">{item.quantity}</span>
                  <button
                    className="px-3 py-1 font-bold"
                    onClick={() => handleQuantityChange(item.id, +1)}
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-2">
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
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CartPage;
