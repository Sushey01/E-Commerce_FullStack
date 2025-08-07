import React from "react";
import Slider from "react-slick";
import CategorySectionCard from "./CategorySectionCard";
import categoryData from "../data/categoryProductData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategorySlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay:true,
    pauseOnHover:true,
    autoPlaySpeed:3000,
    slidesToShow: 4, // Number of cards visible
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="p-1 pt-3" >
      <h2 className="text-2xl flex  justify-center text-gray-500 px-2 font-semibold mb-4">Shop by Category</h2>
      <Slider {...settings}>
        {categoryData.map((category, index) => (
          <div key={index} className="px-2">
            <CategorySectionCard
              title={category.title}
              items={category.items}
              image={category.image}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
