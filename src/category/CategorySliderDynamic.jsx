import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import supabase from "../supabase";
import CategorySectionCard from "./CategorySectionCard";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const CategorySliderDynamic = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: true,
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="p-1 md:p-0 pt-3">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 px-2">
        Shop by Category
      </h2>
      <Slider {...settings}>
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
  );
};

export default CategorySliderDynamic;
