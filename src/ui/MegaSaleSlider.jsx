import React, { useRef, useState } from "react";
import Slider from "react-slick";
import MegaSaleHome from "../components/MegaSaleHome"; // adjust path if needed

const MegaSaleSlider = () => {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [<MegaSaleHome />, <MegaSaleHome />, <MegaSaleHome />];

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setActiveSlide(newIndex),
  };

  return (
    <div className="relative  w-[950px] mx-auto">
      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>{slide}</div>
        ))}
      </Slider>

      {/* Custom Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => sliderRef.current.slickGoTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "w-9 bg-orange-500"
                : "w-4 bg-orange-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MegaSaleSlider;
