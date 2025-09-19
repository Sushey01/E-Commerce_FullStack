import React, { useState } from "react";

const FilterByPrice = ({ onFilter }) => {
  const MIN = 10000;
  const MAX = 250000;
  const STEP = 1000;
  const MIN_GAP = 1000; // Minimum gap between min & max

  const [minPrice, setMinPrice] = useState(MIN);
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [activeSlider, setActiveSlider] = useState(null); // Track which slider is active

  const handleApply = () => {
    onFilter?.({ min: minPrice, max: maxPrice });
  };

  const handleMinChange = (e) => {
    let value = Math.min(Number(e.target.value), maxPrice - MIN_GAP);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    let value = Math.max(Number(e.target.value), minPrice + MIN_GAP);
    setMaxPrice(value);
  };

  const leftPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const rightPercent = 100 - ((maxPrice - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="flex flex-col gap-3 py-3">
      <h2 className="py-2 text-lg text-black">Filter By Price</h2>

      {/* Number Inputs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Min Price</p>
          <input
            type="number"
            min={MIN}
            max={maxPrice - MIN_GAP}
            step={STEP}
            value={minPrice}
            onChange={handleMinChange}
            className="w-full px-3 border border-gray-300 rounded"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Max Price</p>
          <input
            type="number"
            min={minPrice + MIN_GAP}
            max={MAX}
            step={STEP}
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-full px-3 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative mt-6 w-full max-w-md h-8 mx-auto">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded"></div>

        {/* Highlighted Range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        ></div>

        {/* Min Slider */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={minPrice}
          onChange={handleMinChange}
          onMouseDown={() => setActiveSlider("min")}
          onMouseUp={() => setActiveSlider(null)}
          style={{ zIndex: activeSlider === "min" ? 20 : 10 }}
          className="absolute top-1/2 -translate-y-1/2 w-full h-8 bg-transparent appearance-none cursor-pointer"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={maxPrice}
          onChange={handleMaxChange}
          onMouseDown={() => setActiveSlider("max")}
          onMouseUp={() => setActiveSlider(null)}
          style={{ zIndex: activeSlider === "max" ? 20 : 10 }}
          className="absolute top-1/2 -translate-y-1/2 w-full h-8 bg-transparent appearance-none cursor-pointer"
        />
      </div>

      {/* Values Below */}
      <div className="flex justify-between mt-2 text-sm text-gray-700">
        <span>{minPrice}</span>
        <span>{maxPrice}</span>
      </div>

      <button
        onClick={handleApply}
        className="mt-3 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterByPrice;
