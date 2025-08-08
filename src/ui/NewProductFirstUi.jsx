import React from "react";
import ButtonUi from "./OfferButton";
import Iphone from "../assets/images/iphone.webp";
import Background from "../assets/images/newproductbg.jpg"
import NewImage from "../assets/images/watch.jpg"

const NewProductFirstUi = () => {
  return (
    <>
      <div 
      // style={{ backgroundImage: `url(${Background})` }} 
      className="  bg-[#FFF2E3] justify-center border rounded flex flex-col items-center gap-2 h-full p-[16px] py-2 w-full">
        <div >
          <p className="text-xl md:text-3xl  text-[#777] ">Apple MacBook Pro </p>
          <p className="text-xl md:text-3xl  text-[#777] flex justify-center">
            16.2" M2 Max
          </p>
        </div>

        <div className="flex flex-col gap-3 ">
          <p className="text-xs md:text-xl justify-center text-red-600 flex">
            End offer in:
          </p>
          <div className="sm:flex-col  justify-center gap-2 flex md:flex-row">
            <ButtonUi />
            <ButtonUi />
            <ButtonUi />
            <ButtonUi />
          </div>
          <div className="flex justify-center ">
            <img src={Iphone} alt="img" className="max-w-[180px] sm:max-w-full" />
          </div>
          <p className="flex text-center text-gray-400 text-xs md:text-[16px]">
            Gaming PC Element 9260 PRO Level Desktop Intel Core i7-9700F 3.0GHz
            | NVIDIA 16GB DDR4 | 240GB SSD
          </p>
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
            <span className="ml-1.5 text-xs md:text-xl lg:text-lg text-gray-600 ">25 Reviews</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <p className="text-red-500 text-xs md:text-sm line-through">Rs.55000</p>
            <p className="text-[#777] text-sm md:text-lg ">Rs.50000</p>
          </div>

          <div className="flex  items-center">
            <div className="border-1 w-1/2 rounded-full bg-red-600 h-2  "></div>
            <div className="border-1 w-1/2 rounded-full h-2 bg-white"></div>
          </div>

          {/* 📦 Stock & Sales Info */}
          <div className="flex justify-center gap-3 items-center  mb-3">
            <p className="text-xs  text-red-600 md:text-lg  ">620 Sold</p>
            <div className="flex items-center gap-1 text-sm flex-wrap  text-gray-800">
              <svg
                stroke="currentColor"
                fill="#0296a0"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M362.6 192.9L345 174.8c-.7-.8-1.8-1.2-2.8-1.2-1.1 0-2.1.4-2.8 1.2l-122 122.9-44.4-44.4c-.8-.8-1.8-1.2-2.8-1.2-1 0-2 .4-2.8 1.2l-17.8 17.8c-1.6 1.6-1.6 4.1 0 5.7l56 56c3.6 3.6 8 5.7 11.7 5.7 5.3 0 9.9-3.9 11.6-5.5h.1l133.7-134.4c1.4-1.7 1.4-4.2-.1-5.7z" />
              </svg>
              <span className="text-[#0296a0] text-xs md:text-lg ">150 In Stock</span>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default NewProductFirstUi;
