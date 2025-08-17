import React, { useState } from "react";
import featureProducts from "../data/featureProducts";

const FilterByPrice = () => {

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice]=useState(100000);


  function handleApply(){
    if (minPrice<=maxPrice){
      onFilter?.({min:minPrice, max:maxPrice});
    }else{
      alert("Min price should be less than or equal to Max price")
    }
  }


  return (
    <div className="flex flex-col gap-3 py-3">
      <h2 className="py-2 text-lg text-black">Filter By Price</h2>

      {/* Input Section */}
      <div className="flex flex-col w-full sm:flex-row gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Min Price</p>
          <input
            type="number"
            placeholder="0.00"
            value={minPrice}
            onChange={(e)=>setMinPrice(Number(e.target.value))}
            className="w-full  px-3 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Max Price</p>
          <input
            type="number"
            max={1000000}
            value={maxPrice}
            onChange={(e)=>setMaxPrice(Number(e.target.value))}
            placeholder="10,00,000"
            className="w-full  px-3 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Range bar (visual) */}
      <div className="flex items-center w-full">
        <input
        type="range"
        min={0}
        max={100000}
        value={minPrice}
        onChange={(e)=>setMinPrice(Number(e.target.value))}
        className="w-full h-1 bg-teal-500 rounded-lg accent-teal-500"/>
        <input
        type="range"
        min={1000000}
        value={maxPrice}
        onChange={(e)=>setMaxPrice(Number(e.target.value))}
        className="w-full h-1 bg-teal-500 rounded-lg accent-teal-500"/>
      </div>
    </div>
  );
};

export default FilterByPrice;



