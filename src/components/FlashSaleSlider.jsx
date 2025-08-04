import React from "react";
import Slider from "react-slick";
import MonthlySaleCard from "./MonthlySaleCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashSaleSlider({ products }) {
  // 👉 Custom Prev Arrow
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </div>
  );

  // 👉 Custom Next Arrow
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          dots: false,
          centerPadding: "60px",
          // nextArrow:false,
          // prevArrow:false,
        },
      },
    ],
  };

  if (!products || products.length === 0) {
    return <p className="text-gray-500 px-4">No products available</p>;
  }

  return (
    <div className="relative w-full px-0 pb-6">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-1">
            <MonthlySaleCard {...product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
