import React, { useState, useEffect } from "react";
import FlashSaleSlider from "./FlashSaleSlider";
import supabase from "../supabase";

const FlashSalePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Fetched products in FlashSalePage:", data, error);

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []); // Store fetched data in state
      }
    };

    fetchProducts();
  }, []); // Empty dependency array for one-time fetch

  return (
    <div>
      {/* Header with Title and Button */}
      <div className="w-full px-3 py-2 flex justify-between items-center">
        <p className="text-[#777777] text-xl md:text-2xl">Flash Sales</p>
        <button className="flex gap-2 items-center">
          <p className="text-[#0296a0] text-sm underline decoration-[#0296a0]">
            Shop Now
          </p>
          <svg
            width="15"
            height="12"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.44364 2.34251L6.96384 1.67805C6.96377 1.67803 6.9637 1.67801 6.96362 1.67799C6.89144 1.65894 6.82374 1.62579 6.76441 1.58046C6.70503 1.53509 6.65522 1.47841 6.61786 1.41369C6.58049 1.34897 6.55631 1.27749 6.5467 1.20338C6.53712 1.12943 6.54224 1.05433 6.56177 0.982371M9.44364 2.34251L7.22497 0.701537L7.25781 0.58093C7.25774 0.580911 7.25767 0.580891 7.2576 0.580871C7.18556 0.561282 7.11035 0.556136 7.03631 0.565729C6.9622 0.575331 6.89072 0.599513 6.826 0.636879C6.76128 0.674246 6.7046 0.724057 6.65923 0.783439C6.61396 0.842685 6.58084 0.910291 6.56177 0.982371M9.44364 2.34251L0.712481 7.38345C0.582455 7.45852 0.487576 7.58217 0.448717 7.72719C0.409857 7.87222 0.430201 8.02674 0.505271 8.15677C0.580342 8.28679 0.70399 8.38167 0.849015 8.42053C0.994039 8.45939 1.14856 8.43905 1.27859 8.36398L10.0017 3.32768L9.33857 5.79174L9.33844 5.79223C9.30017 5.93681 9.32065 6.09066 9.39543 6.22018C9.47021 6.3497 9.5932 6.44437 9.73755 6.48351L9.73827 6.4837C9.88284 6.52197 10.0367 6.50149 10.1662 6.42671C10.2957 6.35193 10.3904 6.22894 10.4295 6.08459L10.4296 6.08423L11.4562 2.2531C11.4752 2.18706 11.4807 2.11788 11.4724 2.04966L11.3483 2.06469L11.4724 2.04966C11.4641 1.98098 11.442 1.9147 11.4074 1.85478C11.3728 1.79487 11.3265 1.74258 11.2711 1.70103L11.1961 1.80098L9.44364 2.34251Z"
              fill="#0296a0"
              stroke="white"
              strokeWidth="0.25"
            />
          </svg>
        </button>
      </div>

      {/* Product Slider */}
      <div className="w-full box-border overflow-hidden relative">
        <FlashSaleSlider products={products} />
      </div>
    </div>
  );
};

export default FlashSalePage;
