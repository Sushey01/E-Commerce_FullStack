import React from "react";
import Iphone from "../assets/images/iphone.webp";

const MonthlySaleCard = () => {
  return (
<div className="p-4 bg-[#f7f7f7] md:justify-items-center border rounded hover:shadow w-full max-w-sm mx-auto">
      <div className="flex relative justify-center items-center mb-3">
        <div className="absolute top-0 left-0 border rounded-3xl bg-red-600 p-1.5 text-white">
            <p className="text-[14px]">20% off</p>
        </div>
        <img src={Iphone} alt="iPhone" className="w-[75%] rounded" />
      </div>

      <p className="text-lg font-semibold mb-1 text-center">Apple MacBook</p>

      {/* ⭐ Rating */}
      <div className="flex justify-center items-center gap-1 text-yellow-400 text-sm mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            height="14"
            width="14"
            style={{ color: "#ffc107" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
          </svg>
        ))}
        <span className="ml-1  text-gray-600">25 Reviews</span>
      </div>

      {/* 💰 Pricing */}
      <div className="mb-2 flex gap-2 justify-center">
        <p className="text-sm  text-gray-400 line-through">Rs. 2,70,000</p>
        <p className="text-xl md:text-sm lg:text-xl font-bold text-green-600">Rs. 2,50,000</p>
      </div>

      {/* 📦 Stock & Sales Info */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <p className="text-sm  text-gray-600 line-clamp-1 ">620 Sold</p>
        <div className="flex items-center gap-1  text-sm text-gray-800">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M362.6 192.9L345 174.8c-.7-.8-1.8-1.2-2.8-1.2-1.1 0-2.1.4-2.8 1.2l-122 122.9-44.4-44.4c-.8-.8-1.8-1.2-2.8-1.2-1 0-2 .4-2.8 1.2l-17.8 17.8c-1.6 1.6-1.6 4.1 0 5.7l56 56c3.6 3.6 8 5.7 11.7 5.7 5.3 0 9.9-3.9 11.6-5.5h.1l133.7-134.4c1.4-1.7 1.4-4.2-.1-5.7z" />
          </svg>
          <span className="line-clamp-1">150 In Stock</span>
        </div>
      </div>

      {/* 🛒 CTA */}
      <button className=" w-full   text-[#0296a0] p-2.5 border rounded-full  hover:bg-[#0296a0] hover:text-white transition">
        Buy Now
      </button>
    </div>
  );
};

export default MonthlySaleCard;
