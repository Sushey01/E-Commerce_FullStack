import React from "react";
import Navbar from "../components/Navbar";
import SideDropDown from "../ui/SideDropDown";
import MegaSaleHome from "../components/MegaSaleHome";

const HeroSection = () => {
  return (
    <>
    <Navbar/>
      <div className=" flex gap-5 px-6 w-full mt-2 relative">
        <div className="w-[25%] ">
          <SideDropDown/>
           </div>
          <div className="w-[70%]"><MegaSaleHome/></div>
        </div>
        
     
    </>
  );
};

export default HeroSection;
