import React from 'react';

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

export default WishlistItem;
