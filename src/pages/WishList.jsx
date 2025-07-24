// Wishlist.jsx
import React from 'react';

const Wishlist = () => {
  const wishlistItems = [
    {
      store: "Emommcerce Bazar",
      name: "Hair Trimming Vintage",
      details:
        "T9 Electric Hair Clipper Hair Cutting Machine Professional Eyewear size: One size || Frame Color: Black No Warranty",
      price: 437,
      quantity: "01",
    },
    {
      store: "Emommcerce Bazar",
      name: "Hair Trimming Vintage",
      details:
        "T9 Electric Hair Clipper Hair Cutting Machine Professional Eyewear size: One size || Frame Color: Black No Warranty",
      price: 437,
      quantity: "01",
    },
  ];

  const WishlistItem = ({ item }) => (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="text-2xl mr-4 mt-1">🏪</div>
          <div>
            <h3 className="font-semibold text-gray-800">{item.store}</h3>
            <p className="font-medium text-gray-700">{item.name}</p>
            <p className="text-sm text-gray-500">{item.details}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">Rs.{item.price}</p>
          <p className="text-sm text-gray-600">Qty:{item.quantity}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-3">
        <button className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full">
          🗑️
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full">
          🛒
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Whislist</h2>

      <div className="flex text-sm border-b border-gray-300 mb-4 space-x-4">
        <span className="text-teal-600 font-semibold border-b-2 border-teal-500 pb-1 cursor-pointer">
          All
        </span>
        <span className="text-gray-500 pb-1 cursor-pointer">Past Purchase</span>
      </div>

      {wishlistItems.map((item, index) => (
        <WishlistItem key={index} item={item} />
      ))}
    </div>
  );
};

export default Wishlist;
