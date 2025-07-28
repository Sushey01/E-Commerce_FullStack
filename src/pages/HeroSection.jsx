import React from "react";
import SideDropDown from "../ui/SideDropDown";
import MegaSaleSlider from "../ui/MegaSaleSlider";

const HeroSection = () => {
  return (
    <div className="flex p-2 gap-4 lg:px-4  md:px-3 w-full mt-2 relative">
      
      {/* Sidebar: only shown on large screens (≥1024px) */}
      <div className="hidden lg:block w-full lg:w-1/4 ">
        <SideDropDown IsLayout= {false}/>
      </div>

      {/* Slider: full width on mobile and tablet, 75% on desktop */}
      <div className="w-full lg:w-3/4 h-full lg:min-h-[400px] ">
        <MegaSaleSlider />
      </div>
    </div>
  );
};

export default HeroSection;
