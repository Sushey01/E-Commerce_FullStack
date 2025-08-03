import React from "react";
import Slider from "react-slick";
import MonthlySaleCard from "./MonthlySaleCard";

// ✅ Import the required slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FlashSaleSlider({ products }) {
  const settings = {
    dots: false,
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
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 2,
          centerMode:true,
          centerPadding:"60px",
        },
      },
    ],
  };

  if (!products || products.length === 0) {
    return <p className="text-gray-500 px-4">No products available</p>;
  }

  return (
    <div className="w-full px-0">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <MonthlySaleCard
              image={product.image}
              title={product.title}
              discount={product.discount}
              reviewsCount={product.reviewsCount}
              actualPrice={product.actualPrice}
              discountedPrice={product.discountedPrice}
              totalSold={product.totalSold} // Pass directly!
              stockLeft={product.stockLeft} // Pass directly!
              label={product.label}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
