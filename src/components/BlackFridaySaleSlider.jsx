import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import blackFridayProducts from "../data/BlackFridayProduct";
import BlackFridaySalesCard from "./BlackFridaySalesCard"; // Adjust path if needed
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlackFridaySaleSlider = () => {

  const PrevArrow = ({onClick})=>(
    <div className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer"
    onClick={onClick}
    >
      <ChevronLeft size={25}/>
    </div>
  )


  const NextArrow = ({onClick})=>(
    <div className="absolute z-10 overflow-hidden right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md cursor-pointer p-1"
    onClick={onClick}
    >
      <ChevronRight size={25}/>
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
  {blackFridayProducts.map((product, index) => (
    <div key={index} className="px-1">
      <BlackFridaySalesCard
        image={product.image}
        offer={product.offer}
        title={product.title}
        notice={product.notice}
        label={product.label}
      />
    </div>
  ))}
</Slider>

    </div>
            </>
  );
};

export default BlackFridaySaleSlider;
