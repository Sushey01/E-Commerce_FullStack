import React from 'react';
import Iphone from "../assets/images/iphone.webp";

const NewProductCard = () => {
  return (
    <div className="border rounded-lg p-4 bg-[#f7f7f7] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <div className="relative w-full">
        <img
          src={Iphone}
          alt="iPhone"
          className="w-full h-auto object-cover rounded-md"
        />
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          className="absolute top-0 right-0 h-6 w-6 text-red-600 p-1 bg-[#D9D9D980] border rounded-full cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
          ></path>
        </svg>
      </div>

      <div className="mt-4 space-y-2 text-center sm:text-left">
        <p className="text-base font-medium text-gray-800">
          Network Cable Tester LAN Telephone Wire Tracker Diagnose
        </p>

        <div className="flex justify-center sm:justify-start gap-2 items-center">
          <p className="text-[#0296a0] font-semibold text-lg">Rs. 50,000</p>
          <p className="text-sm text-gray-500 line-through">Rs. 55,000</p>
        </div>

        <div className="flex justify-center sm:justify-start">
          <button className="px-6 py-2 rounded-full bg-[#0296a0] text-white hover:bg-[#027c89] transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProductCard;
