import React, { useState } from "react";

const FilterByPrice = ({ onFilter }) => {
  const MIN = 0;

  const [minPrice, setMinPrice] = useState(MIN);
  const [maxPrice, setMaxPrice] = useState(250000); // editable max

  const handleApply = () => {
    if (minPrice <= maxPrice) {
      onFilter?.({ min: minPrice, max: maxPrice });
    } else {
      alert("Min price should be less than or equal to Max price");
    }
  };

  return (
    <div className="flex flex-col gap-3 py-3">
      <h2 className="py-2 text-lg text-black">Filter By Price</h2>

      {/* Number Inputs */}
      <div className="flex flex-col w-full sm:flex-row gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Min Price</p>
          <input
            type="number"
            min={MIN}
            max={maxPrice}
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
            className="w-full px-3 border border-gray-300 rounded"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Max Price</p>
          <input
            type="number"
            min={minPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
            className="w-full px-3 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative mt-6 w-full h-6">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300 rounded"></div>

        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-teal-500 rounded"
          style={{
            left: `${(minPrice / maxPrice) * 100}%`,
            right: `${100 - 100}%`, // highlights full range to maxPrice
          }}
        ></div>

        <input
          type="range"
          min={MIN}
          max={maxPrice}
          value={minPrice}
          onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
          className="absolute top-1/2 transform -translate-y-1/2 w-full h-6 bg-transparent appearance-none"
          style={{ zIndex: 2 }}
        />

        <input
          type="range"
          min={MIN}
          max={maxPrice}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
          className="absolute top-1/2 transform -translate-y-1/2 w-full h-6 bg-transparent appearance-none"
          style={{ zIndex: 1 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-700">
        <span>{minPrice}</span>
        <span>{maxPrice}</span>
      </div>

      <button
        onClick={handleApply}
        className="mt-3 px-4 py-2 bg-teal-500 text-white rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterByPrice;
