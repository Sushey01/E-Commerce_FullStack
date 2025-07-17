import React from "react";
import { CiFilter } from "react-icons/ci";
import {
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaClock,
  FaVrCardboard,
  FaCamera,
  FaHeadset,
  FaPlug,
  FaTv,
  FaMouse,
} from "react-icons/fa";

const SideDropDown = () => {
  return (
    <div className="p-5">
      <div className="border rounded-tl-3xl text-white rounded-tr-3xl w-[25%] flex space-x-12 items-center justify-between gap-3 p-4 bg-[#0296A0]">
        <div className="gap-3 flex">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 17 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 6.5H12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 12H16.125"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H6.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h3>Departments</h3>
        </div>

        <svg
          className="fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="1.5em"
          height="1.5em"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"></path>
        </svg>
      </div>

      <div
        id="bouton"
        className="relative group mt-2 md:justify-between justify-end"
      >
        <button className="w-[25%] justify-between p-2 flex items-center ml-2 md:ml-0 text-gray-400 font-playfair-b font-bold uppercase hover:text-gray-600">
            <div className="border rounded-full p-2 bg-[#E5E7EB]">
          <FaMobileAlt className="text-black size-3" />
            </div>
          Smartphone & Tablets
          <span className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-4 transition-transform group-hover:rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideDropDown;
