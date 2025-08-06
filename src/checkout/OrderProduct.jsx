import React from "react";
import Iphone from "../assets/images/iphone.webp";
import { CircleX, MoveRight } from "lucide-react";

const OrderProduct = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
      <p className="text-xl font-semibold">Order</p>

      <div className="relative justify-center flex">
        <img src={Iphone} alt="Product" className="rounded-md content-center fit-content " />
        <CircleX className="absolute top-2 right-2 text-gray-500 cursor-pointer" />
      </div>

      <div>
        <p className="font-medium text-lg">Iphone 16 Pro Max</p>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <p>Size: XL</p>
          <p>Color: Red</p>
        </div>
      </div>

      <div className="py-2 border-b">
        <div className="flex justify-between text-sm">
          <p>Subtotal</p>
          <p>$139</p>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <p>Discount (50% OFF)</p>
          <p>-$70</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Shipping</p>
          <p className="text-green-700 font-medium">Free</p>
        </div>
      </div>

      <div className="flex justify-between text-lg font-semibold">
        <p>Total</p>
        <p>$69</p>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex justify-center items-center gap-2">
        <span>Checkout</span>
        <MoveRight />
      </button>

      <div className="flex items-start gap-2 text-xs text-gray-500">
        <input type="checkbox" className="mt-1" />
        <p>
          By confirming the order, I accept the{" "}
          <span className="text-blue-600 underline cursor-pointer">terms of the user</span> agreement.
        </p>
      </div>
    </div>
  );
};

export default OrderProduct;
