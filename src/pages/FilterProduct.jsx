import FilterByCategories from "../components/FilterByCategories";
import FilterByColor from "../components/FilterByColor";
import FilterByPrice from "../components/FilterByPrice";
import FilterByBrands from "../components/FilterByBrands";
import FilterByProduct from "../components/FilterByProduct";
import React from "react";


const FilterProduct = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (filterType, value) => {
    const updatedFilters = { ...filters, [filterType]: value };
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="flex p-2 flex-col gap-2 border rounded w-full">
      <FilterByCategories
        selectedCategories={filters.selectedCategories}
        onFilterChange={(categories) =>
          handleFilterChange("selectedCategories", categories)
        }
      />
      <FilterByColor
        selectedColors={filters.selectedColors}
        onFilterChange={(colors) =>
          handleFilterChange("selectedColors", colors)
        }
      />
      <FilterByPrice
        priceRange={filters.priceRange}
        onFilterChange={(priceRange) =>
          handleFilterChange("priceRange", priceRange)
        }
      />
      <FilterByBrands
        selectedBrands={filters.selectedBrands}
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
  );
};

export default FilterProduct;
