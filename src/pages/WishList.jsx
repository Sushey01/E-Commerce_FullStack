import React from "react";
import Sunglass from "../assets/images/sunglass.webp";

const Wishlist = () => {

  

  const wishlistItems = [
    {
      store: "Emommcerce Bazar",
      name: "Hair Trimming Vintage",
      details:
        "T9 Electric Hair Clipper Hair Cutting Machine Professional Eyewear size: One size || Frame Color: Black No Warranty",
      price: 437,
      image: "sunglass",
      quantity: "01",
    },
    {
      store: "Emommcerce Bazar",
      name: "Trimmer Pro",
      details:
        "Electric Trimmer for men || Warranty: 1 year",
      price: 499,
      image: "sunglass",
      quantity: "01",
    },
  ];

  const WishlistItem = ({ item }) => (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {item.image === "sunglass" ? (
            <img
              src={Sunglass}
              alt={item.name}
              className="w-20 h-20 object-cover border rounded"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border rounded">
              {/* SVG fallback icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-700">{item.name}</p>
            <p className="text-sm text-gray-500">{item.details}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">Rs.{item.price}</p>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-3">
        <button
          className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
          title="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full"
          title="Add to Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.4a1 1 0 001 .6h10.4a1 1 0 001-.8l1.2-6.2M7 13h10"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  // Group items by store
  const groupedByStore = wishlistItems.reduce((acc, item) => {
    acc[item.store] = acc[item.store] || [];
    acc[item.store].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Wishlist</h2>

      <div className="flex text-sm border-b border-gray-300 mb-4 space-x-4">
        <span className="text-teal-600 font-semibold border-b-2 border-teal-500 pb-1 cursor-pointer">
          All
        </span>
        <span className="text-gray-500 pb-1 cursor-pointer">Past Purchase</span>
      </div>

      {Object.entries(groupedByStore).map(([store, items]) => (
        <div key={store} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-3">
            🏬 {store}
          </h3>
          {items.map((item, index) => (
            <WishlistItem key={index} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
