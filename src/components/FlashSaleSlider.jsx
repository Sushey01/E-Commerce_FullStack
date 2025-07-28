import React from "react";
import Slider from "react-slick";
import MonthlySaleCard from "./MonthlySaleCard";

// ✅ Import the required slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FlashSaleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="w-full  md:px-4 lg:px-8">
      <Slider {...settings}>
        <div className="px-2 ">
          <MonthlySaleCard />
        </div>
        <div className="px-2">
          <MonthlySaleCard />
        </div>
        <div className="px-2">
          <MonthlySaleCard />
        </div>
        <div className="px-2">
          <MonthlySaleCard />
        </div>
      </Slider>
    </div>
  );
}
