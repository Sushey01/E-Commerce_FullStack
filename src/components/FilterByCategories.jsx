import React from "react";
import FilterByColor from "./FilterByColor";

const FilterByCategories = () => {
  return (
    <>
      <div className="flex p-2 flex-col gap-2 border rounded w-1/2">
        <h2 className="text-lg text-black">Filter By Categories</h2>
       <div className="flex flex-col gap-1">
         <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Smartphone & Tablets
        </label>
        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Laptop & Desktop
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Headphones
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Smart Watches
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Drone & Camera
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Top Selling Products
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Electronic, TVs & More
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Virtual Reality Headsets
        </label>
       </div>
       <FilterByColor/>
      </div>
    </>
  );
};

export default FilterByCategories;
