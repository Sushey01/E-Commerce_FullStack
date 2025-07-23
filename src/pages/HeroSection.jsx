import React from "react";
import SideDropDown from "../ui/SideDropDown";
import MegaSaleSlider from "../ui/MegaSaleSlider";
import Navbar from "../components/Navbar";

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 md:px-6 w-full mt-2 relative">
      {/* Sidebar: visible only on md+ */}
      <div className="hidden md:block w-full md:w-1/4">
        <SideDropDown />
      </div>
      
      {/* Slider: full width on mobile, 75% on desktop */}
      <div className="w-full md:w-3/4">
        <MegaSaleSlider />
      </div>
    </div>
  );
};

export default HeroSection;
