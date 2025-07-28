import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideDropDown from '../ui/SideDropDown';
import HomeProductHead from '../ui/HomeProductHead';

const ProductLayout = () => {
  return (
    <div className="w-full flex-col px-4 pb-2 md:p-4 flex gap-3">
      <div className="hidden md:flex flex-row">
        <div className="hidden  lg:block relative w-[20%] ">
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
