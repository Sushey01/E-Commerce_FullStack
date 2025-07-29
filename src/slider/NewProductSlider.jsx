import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewProductCard from "../components/NewProductCard"; // adjust path if needed

const NewProductSlider = ({ products = [], slidesToShow = 4 }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  if (!products.length) return null;

  return (
    <div className=" w-full">
      <Slider {...settings}>
        {products.map((_, i) => (
          <div key={i} className="px-2">
            <NewProductCard />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewProductSlider;
