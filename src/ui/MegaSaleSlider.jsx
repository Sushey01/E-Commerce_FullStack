import React, { useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import MegaSaleHome from "../components/MegaSaleHome"; // adjust path if needed
import megaProducts from "../data/megaProducts";

const MegaSaleSlider = () => {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // const slides = [<MegaSaleHome />, <MegaSaleHome />, <MegaSaleHome />];

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setActiveSlide(newIndex),
  };

  return (
    <div className="relative w-full h-full mx-auto">
      {/* Slider */}
      <div className="h-full overflow-hidden rounded-lg">
        <Slider ref={sliderRef} {...settings}>
          {megaProducts.map((product, index) => (
            <div key={product.id} className="h-full">
              <MegaSaleHome
                bannerText={product.bannerText}
                title={product.title}
                description={product.description}
                label={product.label}
                image={product.image}
                currentSlide={index + 1}
                totalSlide={megaProducts.length}
                onPrev={() => sliderRef.current.slickPrev()}
                onNext={() => sliderRef.current.slickNext()}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom Dots - Inside slider at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {megaProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => sliderRef.current.slickGoTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSlide === index ? "w-9 bg-orange-500" : "w-4 bg-orange-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MegaSaleSlider;
