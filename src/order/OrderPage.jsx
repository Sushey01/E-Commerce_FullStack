import React from "react";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  User,
} from "lucide-react";
import OrderProfileSection from "./OrderProfileSection";

const OrderPage = () => {
  return (
    <div className="p-4 space-y-6">
      {/*Profile Section*/}

      <div className="flex justify-end  ">
        <User className="border rounded-full p-2 h-10 w-10" />
      </div>
      {/* Header Section */}
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        {/* Order Info */}
        <div className="flex  items-center gap-3">
          <h1 className="text-sm lg:text-lg font-semibold">
            Order ID: 334902445
          </h1>

          <span className="bg-yellow-100 flex  md:text-sm text-yellow-700 border px-3 py-1 rounded-full text-xs">
            Payment Pending
          </span>
          <span className="bg-red-100 text-red-700 border px-3 py-1 rounded-full text-xs md:text-sm">
            Unfulfilled
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="bg-gray-200 px-3 py-1.5 border rounded-md text-xs md:text-sm">
            Restock
          </button>
          <button className="bg-gray-200 flex items-center gap-1 px-3 py-1.5 border rounded-md text-xs md:text-sm">
            <Pencil size={16} />
            Edit
          </button>
          <button className="bg-gray-200 flex items-center gap-1 px-3 py-1.5 border rounded-md text-xs md:text-sm">
            More Actions
            <ChevronDown size={16} />
          </button>
          <div className="flex border rounded-md overflow-hidden">
            <button className="bg-gray-200 px-2 py-1 border-r">
              <ChevronLeft size={16} />
            </button>
            <button className="bg-gray-200 px-2 py-1">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Meta Info */}
      <p className="text-sm text-gray-500">
        January 8, 2024 at 9:48 pm from Draft Orders
      </p>

      <div className="flex gap-3 w-full">
        <div className="flex flex-col w-[80%]">
          {/* Order Item(s) */}
          <OrderItem />

          {/* Fulfillment Actions */}
          <div className="p-4 flex justify-between items-center border rounded-md bg-gray-50">
            <p className="md:text-sm text-xs text-gray-700">
              Effortlessly manage your orders with our intuitive Order List
              Page.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-md bg-white text-xs md:text-sm">
                Fulfill item
              </button>
              <button className="px-4 py-2 rounded-md bg-purple-700 text-white text-xs md:text-sm">
                Create shipping label
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary />
        </div>
        <div className="w-1/4">

        <OrderProfileSection />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
