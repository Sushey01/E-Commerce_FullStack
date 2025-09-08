import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import supabase from "../supabase";
import MonthlySaleCard from "./MonthlySaleCard";
import Spinner from "./Spinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashSaleSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching products:", error.message);
          setProducts([]); // Set empty array on error
        } else {
          console.log("Fetched products:", data); // Debug log
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Unexpected error during fetch:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </div>
  );

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-1 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          dots: false,
          centerPadding: "60px",
          nextArrow: false,
          prevArrow: false,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <p className="text-gray-500 px-4">No products available</p>;
  }

  return (
    <div className="relative w-full px-0 pb-6">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-1.5">
            <MonthlySaleCard
              {...product}
              label="Add to Cart"
              onAddToCart={() => console.log("Added to cart:", product.title)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
