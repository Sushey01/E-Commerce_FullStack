import React from "react";
import Slider from "react-slick";
import MonthlySaleCard from "./MonthlySaleCard";

export default function FlashSaleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <div>
 <Slider {...settings}>
      <div>
        <MonthlySaleCard/>
      </div>
       <div>
        <MonthlySaleCard/>
      </div>
       <div>
        <MonthlySaleCard/>
      </div>
  
    </Slider>
    </div>
   
  );
}

