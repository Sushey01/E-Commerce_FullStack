import { X } from "lucide-react";
import React from "react";

const TopWelcomeBannerMavbar = () => {
  // The content of your banner. It is defined once here for easy editing.
  const bannerContent =
    "Sowis eCommerce CMS — a next-generation platform redefining online retail for modern businesses. Trusted by a growing community of innovators and entrepreneurs, Sowis empowers seamless, scalable, and secure eCommerce experiences across industries. Welcome to Sowis eCommerce CMS v1.0 — your gateway to smarter selling and digital success.";

  return (
    // Main container: uses flex and justify-between to place marquee and button correctly.
    // items-center ensures vertical alignment.
    <div className="bg-black flex p-3 justify-between items-center overflow-hidden">
      {/* This is the Marquee Container:
        - overflow-hidden: Essential to hide the duplicated content until it scrolls into view.
        - flex-1: Allows this container to take up all space between the edge and the close button.
      */}
      <div className="flex-1 overflow-hidden">
        {/* The Scrolling Element:
          - whitespace-nowrap: Prevents text wrapping.
          - animate-marquee: Applies the animation defined in tailwind.config.js.
          - flex: Ensures the content copies align horizontally.
        */}
        <div className="flex whitespace-nowrap animate-marquee items-center w-[200%]">
          {/* --- Marquee Content Duplication --- */}
          {/* Copy 1: The original content. Added mx-8 for spacing between copies. */}
          <h1 className="text-white text-base mx-8">{bannerContent}</h1>

          {/* Copy 2: The essential duplicate content to create the infinite loop. */}
          <h1 className="text-white text-base mx-8">{bannerContent}</h1>
          {/* --- End Duplication --- */}
        </div>
      </div>

      {/* Close Button Container */}
      {/* pl-4 adds padding to separate the marquee text from the button. */}
      <div className="pl-4 py-2 flex items-center flex-shrink-0">
        <button className="text-white bg-black">
          <X size={20} /> {/* Use size prop for lucide-react icon */}
        </button>
      </div>
    </div>
  );
};

export default TopWelcomeBannerMavbar;
