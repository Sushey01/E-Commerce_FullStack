import React from "react";
import Slider from "react-slick";
import CategorySectionCard from "./CategorySectionCard";
import categoryData from "../data/categoryProductData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const CategorySlider = () => {


  const navigate = useNavigate();

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
    <div className="p-1 md:p-0 pt-3">
      <h2 className="text-2xl flex   text-[#777] px-2  mb-4">
        Shop by Category
      </h2>
      <Slider {...settings}>
        {categoryData.map((category, index) => (
          <div
            key={index}
            className="px-1.5"
            onClick={() => navigate(`/category?id=${category.id}`)}
            // onClick={() => navigate(`/browse?category=${category.id}`)}
          >
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
