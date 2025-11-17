import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import supabase from "../supabase";
import CategorySectionCard from "./CategorySectionCard";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySliderDynamic = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, image_url")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) return <Spinner />;

  // Calculate if we're at the last slide
  // When currentSlide + slidesToShow >= total categories, we've reached the end
  const isAtEnd = currentSlide + slidesToShow >= categories.length;

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-700 hover:text-indigo-600 ${
        isAtEnd ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-700 hover:text-indigo-600 ${
        currentSlide === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: false,
    pauseOnHover: true,
    autoplaySpeed: 3000,
    slidesToShow: 5,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
    afterChange: (current) => {
      // Update slidesToShow based on current viewport
      const slider = sliderRef.current;
      if (slider) {
        setSlidesToShow(slider.props.slidesToShow);
      }
    },
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <div className="p-1 md:p-0 pt-3 relative">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 px-2">
        Shop by Category
      </h2>
      <div className="relative px-2 md:px-4 lg:px-8">
        <Slider ref={sliderRef} {...settings}>
          {categories.map((category) => (
            <div
              key={category.id}
              className="px-1.5"
              onClick={() => navigate(`/subcategory?id=${category.id}`)}
            >
              <CategorySectionCard
                title={category.name}
                items="Explore products"
                image={category.image_url || "/images/placeholder.png"}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategorySliderDynamic;
