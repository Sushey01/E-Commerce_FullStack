import React, { useEffect, useState } from "react";
import Slider from "react-slick";
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
        // Only top-level categories (main categories)
        const mainCategories = data.filter((c) =>
          [
            "Electronics",
            "Fashion",
            "Home & Garden",
            "Beauty & Health",
            "Books & Media",
          ].includes(c.name)
        );
        setCategories(mainCategories);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) return <Spinner />;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
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
            onClick={() => navigate(`/category?id=${category.id}`)}
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
