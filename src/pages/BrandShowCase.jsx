import React, { useState, useEffect } from "react";
import supabase from "../supabase";

const BrandShowCase = () => {
  const [brands, setBrands] = useState([]);

  // Fetch brands on component mount
  useEffect(() => {
    const getBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("brand_id, brand_name, logo_url");

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      setBrands(data); // <-- set state correctly here
    };

    getBrands();
  }, []);

  return (
    <div className="bg-white py-10  overflow-hidden">
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap w-[200%]">
          {/* First loop */}
          {brands.map((brand) => (
            <img
              key={brand.brand_id}
              src={brand.logo_url}
              alt={brand.brand_name}
              className="h-16 w-auto mx-10 object-contain"
            />
          ))}

          {/* Second loop for continuous scrolling */}
          {brands.map((brand) => (
            <img
              key={`copy-${brand.brand_id}`}
              src={brand.logo_url}
              alt={brand.brand_name}
              className="h-16 w-auto mx-10 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandShowCase;
