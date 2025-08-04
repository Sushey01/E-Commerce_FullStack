import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BlackFridaySalesCard from "./BlackFridaySalesCard"; // Adjust path if needed

const BlackFridaySaleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          centerPadding:"60px",
          centerMode:true,
          dots:false,
        },
      },
    ],
  };

  return (
    <div className="w-full mx-auto pb-6">
      <Slider {...settings}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="px-2">
            <BlackFridaySalesCard />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlackFridaySaleSlider;
