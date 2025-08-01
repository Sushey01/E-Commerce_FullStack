import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideDropDown from '../ui/SideDropDown';
import HomeProductHead from '../ui/HomeProductHead';

const ProductLayout = () => {
  return (
    <div className="w-full flex-col  pb-2 flex gap-3 ">
      <div className="hidden md:flex flex-row p-3 py-2">
        <div className="hidden  lg:block relative w-[20%] z-50 ">
          <SideDropDown IsLayout={true}/>
        </div>
        <div className="lg:w-[80%] md:w-full">
          <HomeProductHead />
        </div>
      </div>

      {/* Render child routes here */}
      <Outlet />
    </div>
  );
};

export default ProductLayout;
