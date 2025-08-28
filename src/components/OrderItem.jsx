import { ChevronDown, Trash } from "lucide-react";
import React from "react";

const OrderItem = ({
  title = "Macbook Air",
  category = "Laptop",
  price = 500,
  quantity = 3,
  variant = "Medium Black",
  status = "Unfulfilled",
  image,
}) => {
  const total = price * quantity;

  return (
    <div className="p-4 border rounded-md space-y-3 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">Order Item</p>
        <ChevronDown size={18} className="text-gray-500" />
      </div>

      {/* Status Badge */}
      <span className="inline-block border rounded-full px-3 py-1 text-xs font-medium text-red-600 bg-red-100">
        {status}
      </span>

      <p className="text-sm text-gray-500">
        Use this personalized guide to get your store up and running.
      </p>

      {/* Item Row */}
      <div className="flex gap-3 w-full items-start">
        {/* Product Image */}
        <img
          src={image}
          alt={title}
          className="w-14 h-14 object-cover rounded-md border"
        />

        {/* Product Details */}
        <div className="flex flex-col w-full">
          {/* Category */}
          <p className="text-sm text-gray-500">{category}</p>

          {/* Title + Actions */}
          <div className="flex justify-between items-center w-full">
            <p className="text-base font-medium">{title}</p>

            <div className="flex items-center gap-2">
              <button className="border px-2 py-1 rounded-sm text-sm text-gray-600">
                {quantity} × ${price.toFixed(2)}
              </button>
              <button className="text-sm font-semibold">
                ${total.toFixed(2)}
              </button>
              <Trash className="cursor-pointer text-gray-500 hover:text-red-500" />
            </div>
          </div>

          {/* Variant */}
          <p className="text-sm text-gray-600 pt-1">{variant}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
