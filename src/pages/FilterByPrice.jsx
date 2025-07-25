import React from "react";

const FilterByPrice = () => {
  return (
    <>
      <div className="flex flex-col gap-3 py-3">
        <h2 className="py-2 text-lg text-black">Filter By Price</h2>
        <div className="flex gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Min Price</p>
            <input
              type="number"
              placeholder="0.00"
              className="w-32 px-3  border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Max Price</p>
            <input
              type="number"
              max={1000000}
              placeholder="10,00,000"
              className="w-32 px-3  border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center w-full">
          <button className="border rounded-full w-5 h-5 bg-teal-500"></button>
          <div className="flex-grow border-t-4  border-teal-500" />
          <button className="border rounded-full w-5 h-5 bg-teal-500"></button>
        </div>
      </div>
    </>
  );
};

export default FilterByPrice;
