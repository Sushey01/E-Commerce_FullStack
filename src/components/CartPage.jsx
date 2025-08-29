import React, { useState, useEffect } from "react";
import { FaTrash, FaHeart, FaStore } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import Sunglass from "../assets/images/sunglass.webp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();

  // Load cart from localStorage safely
  const data = localStorage.getItem("cartlist");
  const initialCart = data ? JSON.parse(data) : [];

  // Ensure each item has id and quantity
  const [cartItems, setCartItems] = useState(
    initialCart.map((item) => ({
      id: item.id ?? Date.now() + Math.random(), // fallback unique id
      quantity: item.quantity ?? 1,
      ...item,
    }))
  );

  // ✅ Selected items state
  const [selectedItems, setSelectedItems] = useState([]);

  // Keep localStorage in sync whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartlist", JSON.stringify(cartItems));
  }, [cartItems]);

  // Delete a single item
  const handleDelete = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((sel) => sel.filter((sid) => sid !== id));
  };

  // Delete all items
  const handleDeleteAll = () => {
    setCartItems([]);
    setSelectedItems([]);
    localStorage.removeItem("cartlist");
  };



  // Change quantity
  const handleQuantityChange = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) + change) }
          : item
      )
    );
  };

  // Add to Wishlist
  const handleAddToWishlist = (item) => {
    const data = localStorage.getItem("wishlist");
    const wishlist = data ? JSON.parse(data) : [];

    // check if item already exists in wishlist
    const exists = wishlist.some(
      (w) =>
        w.id === item.id &&
        JSON.stringify(w.variations) === JSON.stringify(item.variations)
    );

    if (!exists) {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success(`${item.name || item.title} is added to wishlist!`);
    } else {
      toast.success(`${item.name || item.title} already added in wishlist!`);
    }
  };

  // Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    const seller = item.seller ?? "Unknown Seller";
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {});

  // ✅ Toggle Select All
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // ✅ Toggle single checkbox
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">🛒 My Cart</h2>

      <div className="flex justify-between items-center mb-6">
        {/* ✅ Select All */}
        <button
          className="bg-gray-100 text-black px-4 py-1 rounded-full flex items-center gap-2 text-sm"
          onClick={toggleSelectAll}
        >
          <input
            type="checkbox"
            checked={
              selectedItems.length === cartItems.length && cartItems.length > 0
            }
            readOnly
          />
          Select All ({cartItems.length})
        </button>

        <div className="flex gap-3">
          <button
            className="bg-black text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm"
            onClick={handleDeleteAll}
          >
            Delete All <BsTrash />
          </button>
        </div>
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
              {/* ✅ Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
              />

              <img
                src={item.image ?? Sunglass}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 space-y-1">
                <p className="text-base font-semibold leading-snug line-clamp-2">
                  {item.title || item.name}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.details ?? ""}
                </p>
                <p className="text-sm text-gray-500">{item.warranty ?? ""}</p>

                {/* ✅ Variations */}
                {item.variations && Object.keys(item.variations).length > 0 && (
                  <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                    {Object.entries(item.variations).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 bg-gray-200 rounded-md text-xs"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
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
                  <span className="px-3 py-1 bg-white">
                    {item.quantity ?? 1}
                  </span>
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
                  <button
                    onClick={() => handleAddToWishlist(item)}
                    className="bg-gray-200 p-2 rounded-full hover:bg-white"
                  >
                    <FaHeart className="hover:text-red-500 " />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate("/form", {
              state: {
                selectedItems: cartItems.filter((item)=>
                selectedItems.includes(item.id))
              }
            })}
            disabled={selectedItems.length === 0}
            className="bg-blue-600 text-white float-end px-6 py-2 rounded-lg mt-4 disabled:opacity-50"
          >
            Checkout ({selectedItems.length})
          </button>
        </div>
      ))}

      {cartItems.length === 0 && (
        <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
