import React, { useState } from "react";
import FilterByCategories from "../components/FilterByCategories";
import FilterByColor from "../components/FilterByColor";
import FilterByPrice from "../components/FilterByPrice";
import FilterByBrands from "../components/FilterByBrands";
import FilterByProduct from "../components/FilterByProduct";

const FilterProduct = () => {
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedColors: [], // Corrected from selectedColor to selectedColors
    priceRange: [0, 10000],
    selectedPrice: [], // Consider removing if redundant with priceRange
    selectedBrands: [],
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [filterType]: value };
      console.log("Filters updated in FilterProduct:", newFilters);
      return newFilters;
    });
  };

  return (
    <>
      <div className="flex p-2 flex-col gap-2 border rounded w-full">
        <FilterByCategories
          onFilterChange={(categories) =>
            handleFilterChange("selectedCategories", categories)
          }
        />
        <FilterByColor
          onFilterChange={(colors) =>
            handleFilterChange("selectedColors", colors)
          }
        />
        <FilterByPrice
          onFilterChange={(priceRange) =>
            handleFilterChange("priceRange", priceRange)
          }
        />
        <FilterByBrands
          onFilterChange={(brands) =>
            handleFilterChange("selectedBrands", brands)
          }
        />
        <FilterByProduct
          onFilterChange={(products) =>
            handleFilterChange("selectedProducts", products)
          }
        />
      </div>
    </>
  );
};

export default FilterProduct;
