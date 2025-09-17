import React, { useState } from "react";

const categories = [
  "Smartphone & Tablets",
  "Laptop & Desktop",
  "Headphones",
  "Smart Watches",
  "Drone & Camera",
  "Top Selling Products",
  "Electronic, TVs & More",
  "Virtual Reality Headsets",
];

const FilterByCategories = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    if (onFilterChange) {
      console.log("Categories updated:", updatedCategories); // Debug
      onFilterChange(updatedCategories);
    }
  };

  return (
    <>
      <div className="flex p-2 flex-col gap-2 w-full">
        <h2 className="text-lg text-black">Filter By Categories</h2>
        <div className="flex flex-col gap-1">
          {categories.map((category) => (
            <label key={category} className="gap-2 flex text-[#4b5563]">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterByCategories;
