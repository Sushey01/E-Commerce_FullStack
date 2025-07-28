import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideDropDown from '../ui/SideDropDown';
import HomeProductHead from '../ui/HomeProductHead';

const ProductLayout = () => {
  return (
    <div className="w-full flex-col p-4 flex gap-3">
      <div className="hidden md:flex flex-row">
        <div className="hidden  lg:block relative w-[20%] ">
          <SideDropDown IsLayout={true}/>
        </div>
        <div className="w-[80%]">
          <HomeProductHead />
        </div>
      </div>

      {/* Render child routes here */}
      <Outlet />
    </div>
  );
};

export default ProductLayout;
