import React, { useState } from 'react';
import HomeProductFilterSort from '../components/HomeProductFilterSort';
import SideDropDown from '../ui/SideDropDown';
import HomeProductHead from '../ui/HomeProductHead';
import FilterProduct from './FilterProduct';
import ProductLayout from '../layouts/ProductLayout';

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

      {/* Filter drawer - only for mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          showDrawer ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-end px-4 py-3 border-b">
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
      


       

        {/* Main content area */}
        <div className="flex gap-2 md:w-full lg:w-full">
      
      <div className='w-1/5'>
          <FilterProduct/>
        
      </div>
      <div>
          <HomeProductFilterSort onFilterClick={() => setShowDrawer(true)} />

      </div>
           
        </div>
   
    </>
  );
};

export default HomeProduct;
