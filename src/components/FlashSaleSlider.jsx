import React from "react";
import Slider from "react-slick";
import MonthlySaleCard from "./MonthlySaleCard";
import supabase from "../supabase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashSaleSlider({ products = [] }) {
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

  console.log("Products in FlashSaleSlider:", products); // Debug log

  const handleBuyNow = async (product) => {
    try {
      // Ensure price is in cents (adjust if your price is already in dollars)
      const priceInCents = product.price;
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            product_id: product.id,
            product_name: product.title,
            price: priceInCents, // Price should be in cents for Stripe
            quantity: 1,
          },
        }
      );

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Failed to initiate checkout. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      }
    } catch (e) {
      console.error("Buy Now error:", e);
      alert("An error occurred. Please try again.");
    }
  };

  if (!products || products.length === 0) {
    return <p className="text-gray-500 px-4">No products available</p>;
  }

  return (
    <div className="relative w-full px-0 pb-6">
      <Slider {...settings}>
        {products.map((product) => {
          console.log(`Image source for product ${product.id}:`, product.image); // Debug log
          return (
            <div key={product.id} className="px-1.5">
              <MonthlySaleCard
                id={product.id}
                discount={product.discount || 0}
                image={product.image || "/placeholder.jpg"} // Fallback image
                title={product.title || "Unnamed Product"}
                reviews={product.reviews || 0}
                rating={product.rating || 0}
                oldPrice={product.oldPrice || 0}
                price={product.price || 0}
                sold={product.sold || 0}
                inStock={product.inStock || 0}
                label="Buy Now"
                onBuyNow={() => handleBuyNow(product)}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
