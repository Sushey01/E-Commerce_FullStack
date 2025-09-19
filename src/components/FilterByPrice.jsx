import React, { useState, useEffect } from "react";
import "./FilterByPrice.css";

const MIN = 10000;
const MAX = 250000;
const STEP = 1000;
const MIN_GAP = 1000;

const FilterByPrice = ({ value, onFilter }) => {
  const [minPrice, setMinPrice] = useState(value?.min || MIN);
  const [maxPrice, setMaxPrice] = useState(value?.max || MAX);
  const [activeSlider, setActiveSlider] = useState(null);



 
  // Sync sliders if value prop changes
  useEffect(() => {
    if (value) {
      setMinPrice(value.min);
      setMaxPrice(value.max);
    }
  }, [value]);

  const handleApply = () => {
    onFilter?.({ min: minPrice, max: maxPrice });
  };

  const handleMinChange = (e) => {
    let val = Math.min(Number(e.target.value), maxPrice - MIN_GAP);
    setMinPrice(val);
  };

  const handleMaxChange = (e) => {
    let val = Math.max(Number(e.target.value), minPrice + MIN_GAP);
    setMaxPrice(val);
  };

  const leftPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const rightPercent = 100 - ((maxPrice - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="flex flex-col gap-3 py-3">
      <h2 className="py-2 text-lg font-semibold text-black">Filter By Price</h2>

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
            className="w-full px-3 py-2 border border-gray-300 rounded"
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
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Slider */}
      <div className="multi-slide-input-container relative mt-6 w-full max-w-md h-8 mx-auto">
        <div className="track-slider bg-gray-300"></div>
        <div
          className="range-slider bg-teal-500"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        ></div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={minPrice}
          onChange={handleMinChange}
          onMouseDown={() => setActiveSlider("min")}
          onMouseUp={() => setActiveSlider(null)}
          className="thumb thumb-left"
          style={{ zIndex: activeSlider === "min" ? 20 : 10 }}
        />

        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={maxPrice}
          onChange={handleMaxChange}
          onMouseDown={() => setActiveSlider("max")}
          onMouseUp={() => setActiveSlider(null)}
          className="thumb thumb-right"
          style={{ zIndex: activeSlider === "max" ? 20 : 10 }}
        />
      </div>

      {/* Display values */}
      <div className="flex justify-between mt-2 text-sm text-gray-700">
        <span>{minPrice}</span>
        <span>{maxPrice}</span>
      </div>

      <button
        onClick={handleApply}
        className="mt-3 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterByPrice;
