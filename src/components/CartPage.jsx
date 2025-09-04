import React, { useState, useEffect } from "react";
import { FaTrash, FaHeart, FaStore } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import Sunglass from "../assets/images/sunglass.webp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  saveCartItem,
  deleteCartItem,
  clearCart,
} from "../supabase/carts";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // ✅ Load cart items from DB
  useEffect(() => {
    (async () => {
      const items = await fetchCartItems();
      setCartItems(
        items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant ?? {},
          title: item.title ?? item.name ?? "Product",
          image: item.image ?? Sunglass,
          seller: item.seller ?? "Unknown Seller",
        }))
      );
    })();
  }, []);

  // ✅ Delete single item
  const handleDelete = async (id) => {
    await deleteCartItem(id);
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((sel) => sel.filter((sid) => sid !== id));
  };

  // ✅ Delete all items
  const handleDeleteAll = async () => {
    await clearCart();
    setCartItems([]);
    setSelectedItems([]);
  };

  // ✅ Change quantity
  const handleQuantityChange = async (id, change) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + change);
          saveCartItem({ ...item, quantity: newQty }); // Update in DB
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // ✅ Add to Wishlist (localStorage still)
  const handleAddToWishlist = (item) => {
    const data = localStorage.getItem("wishlist");
    const wishlist = data ? JSON.parse(data) : [];

    const exists = wishlist.some(
      (w) =>
        w.id === item.product_id &&
        JSON.stringify(w.variant) === JSON.stringify(item.variant)
    );

    if (!exists) {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success(`${item.title} is added to wishlist!`);
    } else {
      toast.success(`${item.title} already added in wishlist!`);
    }
  };

  // ✅ Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    const seller = item.seller ?? "Unknown Seller";
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {});

  // ✅ Toggle select all
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
        {/* Select All */}
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
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
              />

              <img
                src={item.image}
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

                {item.variant && Object.keys(item.variant).length > 0 && (
                  <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                    {Object.entries(item.variant).map(([key, value]) => (
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
            onClick={() =>
              navigate("/order", {
                state: {
                  selectedItems: cartItems.filter((item) =>
                    selectedItems.includes(item.id)
                  ),
                },
              })
            }
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
