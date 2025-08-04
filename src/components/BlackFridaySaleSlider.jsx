import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BlackFridaySalesCard from "./BlackFridaySalesCard"; // Adjust path if needed
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlackFridaySaleSlider = () => {

  const PrevArrow = ({onClick})=>(
    <div className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer"
    onClick={onClick}
    >
      <ChevronLeft size={20}/>
    </div>
  )


  const NextArrow = ({onClick})=>(
    <div className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md cursor-pointer p-1"
    onClick={onClick}
    >
      <ChevronRight size={20}/>
    </div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
              centerPadding:"60px",
          centerMode:true,
           nextArrow:<NextArrow/>,
    prevArrow:<PrevArrow/>,

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
          slidesToShow: 2,
          centerPadding:"60px",
          centerMode:true,
          dots:false,
 
        },
      },

       {
        breakpoint: 480, // mobile
        settings: {
          slidesToShow: 1,
          centerPadding:"60px",
          centerMode:true,
          dots:false,
                   nextArrow:false,
          prevArrow:false,
          infinite:true,
        },
      },
    ],
  };

  return (
    <>
    <div className="w-full mx-auto pb-6">
      <Slider {...settings}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="px-1">
            <BlackFridaySalesCard />
          </div>
        ))}
      </Slider>
    </div>
            </>
  );
};

export default BlackFridaySaleSlider;
