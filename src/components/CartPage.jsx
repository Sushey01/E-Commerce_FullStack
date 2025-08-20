import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaHeart, FaStore } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import Sunglass from "../assets/images/sunglass.webp";
import {
  removeFromCartlist,
  addToCartlist,
} from "../features/cartlistSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cartlist.items);
  const dispatch = useDispatch();

  // 🔄 keep localStorage in sync with Redux
  useEffect(() => {
    localStorage.setItem("cartlist", JSON.stringify(cartItems));
  }, [cartItems]);

  // Delete one
  const handleDelete = (id) => {
    dispatch(removeFromCartlist(id));
  };

  // Delete all
  const handleDeleteAll = () => {
    cartItems.forEach((item) => dispatch(removeFromCartlist(item.id)));
  };

  // Change qty (re-add same item with updated quantity)
  const handleQuantityChange = (id, change) => {
    const item = cartItems.find((it) => it.id === id);
    if (!item) return;

    const updated = {
      ...item,
      quantity: Math.max(1, (item.quantity ?? 1) + change),
    };

    // Remove old + re-add updated
    dispatch(removeFromCartlist(id));
    dispatch(addToCartlist(updated));
  };

  // Group by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    const seller = item.seller ?? "Unknown Seller";
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">🛒 My Cart</h2>

      <div className="flex justify-between items-center mb-6">
        <button className="bg-gray-100 text-black px-4 py-1 rounded-full flex items-center gap-2 text-sm">
          🗂️ Select All ({cartItems.length})
        </button>
        <button
          className="bg-black text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm"
          onClick={handleDeleteAll}
        >
          Delete All <BsTrash />
        </button>
      </div>

      {Object.entries(groupedItems).map(([seller, items]) => (
        <div key={seller} className="mb-8">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
            <FaStore className="text-gray-700" /> {seller}
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 rounded-lg p-4 flex flex-row gap-4 items-start md:items-center justify-between mb-4"
            >
              <img
                src={item.image ?? Sunglass}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 space-y-1">
                <p className="text-base font-semibold leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.details ?? ""}
                </p>
                <p className="text-sm text-gray-500">{item.warranty ?? ""}</p>
              </div>

              <div className="flex flex-col gap-3 items-end min-w-[150px]">
                <div className="text-lg font-bold text-gray-800">
                  Rs.{item.price ?? 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Qty: {(item.quantity ?? 1).toString().padStart(2, "0")}
                </div>

                <div className="flex border border-orange-500 rounded overflow-hidden text-sm">
                  <button
                    className="px-3 py-1 font-bold"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-white">{item.quantity ?? 1}</span>
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

      {cartItems.length === 0 && (
        <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
