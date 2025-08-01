import React, { useState } from "react";
import HomeProductFilterSort from "../components/HomeProductFilterSort";
import FilterProduct from "./FilterProduct";

const HomeProduct = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      {/* Overlay for mobile filter drawer */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Filter drawer - mobile only */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          showDrawer ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 py-3 border-b">
          <button
            onClick={() => setShowDrawer(false)}
            className="text-gray-600 hover:text-red-500 text-2xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Filter content */}
        <div className="p-4">
          <FilterProduct />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-2 p-3 pt-0 w-full">
        {/* Left sidebar filter for desktop */}
        <div className="hidden md:block w-1/5">
          <FilterProduct />
        </div>

        {/* Product sort and list */}
        <div className="flex-1">
          <HomeProductFilterSort onFilterClick={() => setShowDrawer(true)} />
        </div>
      </div>
    </>
  );
};

export default HomeProduct;
