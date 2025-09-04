import { ChevronDown, Trash } from "lucide-react";
import React from "react";
import Laptop from "../assets/images/laptop.webp";

const OrderItem = ({ items = [] }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const total = item.price * item.quantity;
        // Convert variant object to a string
        const variantString = item.variant
          ? Object.entries(item.variant)
              .map(
                ([key, value]) =>
                  `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
              )
              .join(", ")
          : "No variants";

        return (
          <div key={index} className="p-4 border rounded-md space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Order Item</p>
              <ChevronDown size={18} className="text-gray-500" />
            </div>
            <span className="inline-block border rounded-full px-3 py-1 text-xs font-medium text-red-600 bg-red-100">
              {item.status || "Unfulfilled"}
            </span>
            <p className="text-xs md:text-sm text-gray-500">
              Use this personalized guide to get your store up and running.
            </p>
            <div className="flex gap-3 w-full items-start">
              <img
                src={item.image || Laptop}
                alt={item.title}
                className="w-14 h-14 object-cover rounded-md border"
              />
              <div className="flex flex-col w-full">
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base font-medium">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <button className="border px-2 py-1 rounded-sm text-xs md:text-sm text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </button>
                    <button className="text-sm font-semibold">
                      ${total.toFixed(2)}
                    </button>
                    <Trash className="cursor-pointer text-gray-500 hover:text-red-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 pt-1">{variantString}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderItem;
