import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/wishlistSlice";
import Sunglass from "../assets/images/sunglass.webp";
import { ShoppingCart } from "lucide-react";
import { addToCartlist } from "../features/cartlistSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];

 

  const removeItem = (id) => {
    dispatch(removeFromWishlist(id));
  };

const addItem = (item) => {
  dispatch(addToCartlist(item)); // pass the whole object
  toast.success(`${item.name||item.title} added to cart!`)
  console.log("toast object:", toast)
};


  const WishlistItem = ({ item }) => (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={item.image || Sunglass}
            alt={item.name || item.title}
            className="w-20 h-20 object-cover border rounded"
          />
          <div>
            <p className="font-medium text-gray-700">{item.name || item.title}</p>
            <p className="text-sm text-gray-500">{item.details || ""}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">Rs.{item.price || 0}</p>
          <p className="text-sm text-gray-600">Qty: {(item.quantity || 1).toString().padStart(2, "0")}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-3">
        <button
          className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
          title="Remove"
          onClick={() => removeItem(item.id)}
        >
          ✖
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full"
          title="Add to Cart"
          onClick={()=> addItem(item)}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const groupedByStore = wishlistItems.reduce((acc, item) => {
    const store = item.store || "Unknown Store";
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Wishlist</h2>

      {wishlistItems.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Your wishlist is empty.
        </p>
      )}

      {Object.entries(groupedByStore).map(([store, items]) => (
        <div key={store} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-3">
            🏬 {store}
          </h3>
          {items.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
