import React from "react";
import SideDropDown from "../ui/SideDropDown";
import MegaSaleSlider from "../ui/MegaSaleSlider";

const HeroSection = ({ IsLayout }) => {
  return (
    <div className="flex gap-4 lg:p-2 w-full mb-6 relative">
      {/* Sidebar: only shown on large screens (≥1024px) */}
      <div className="hidden lg:block w-full lg:w-1/4">
        <SideDropDown IsLayout={false} />
      </div>

      {/* Slider: full width on mobile and tablet, 75% on desktop */}
      <div className="w-full lg:w-3/4">
        <div className="h-full w-full min-h-[280px] lg:min-h-[620px] lg:max-h-[620px]">
          <MegaSaleSlider />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
