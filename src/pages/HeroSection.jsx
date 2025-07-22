import React from "react";
import Navbar from "../components/Navbar";
import SideDropDown from "../ui/SideDropDown";
import MegaSaleSlider from "../ui/MegaSaleSlider"
import MegaSaleHome from "../components/MegaSaleHome";

const HeroSection = () => {
  return (
    <>
    {/* <Navbar/> */}
      <div className=" flex gap-4 px-6 w-full mt-2 relative">
        <div className="w-[25%] md:block hidden">
          <SideDropDown />
           </div>
          <div className="w-[75%]"><MegaSaleSlider/></div>
        </div>
        
     
    </>
  );
};

export default HeroSection;
