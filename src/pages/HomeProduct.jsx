import React, { useState } from 'react';
import HomeProductFilterSort from '../components/HomeProductFilterSort';
import SideDropDown from '../ui/SideDropDown';
import HomeProductHead from '../ui/HomeProductHead';
import FilterProduct from './FilterProduct';

const HomeProduct = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      {/* Overlay for mobile filter drawer */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Filter drawer - mobile only */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          showDrawer ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex float-right items-center px-4 py-3 border-b">
          {/* Cross button for mobile */}
          <button
            onClick={() => setShowDrawer(false)}
            className="text-gray-600 hover:text-red-500 text-2xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          <FilterProduct />
        </div>
      </div>

      {/* Main layout */}
      <div className="w-full p-4 flex gap-3">
        {/* Sidebar - visible on large screens */}
        <div className="hidden w-[25%] lg:flex flex-col gap-2">
          <SideDropDown />
          <FilterProduct />
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:w-full lg:w-full">
          <HomeProductHead />
          <HomeProductFilterSort onFilterClick={() => setShowDrawer(true)} />
        </div>
      </div>
    </>
  );
};

export default HomeProduct;
