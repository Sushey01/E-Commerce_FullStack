import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import blackFridayProducts from "../data/BlackFridayProduct";
import BlackFridaySalesCard from "./BlackFridaySalesCard";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute z-10 left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md border hover:shadow-lg"
  >
    <ChevronLeft className="w-6 h-6 text-gray-600" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute z-10 right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md border hover:shadow-lg"
  >
    <ChevronRight className="w-6 h-6 text-gray-600" />
  </button>
);

const BlackFridaySaleSlider = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "30px",
          dots: false,
          // infinite:true,
          nextArrow: null,
          prevArrow: null,
        },
      },
    ],
  };

  return (
    <div className="relative ">
      <Slider {...settings}>
        {blackFridayProducts.map((product, index) => (
          <div key={index} className="px-1">
            <BlackFridaySalesCard {...product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlackFridaySaleSlider;
