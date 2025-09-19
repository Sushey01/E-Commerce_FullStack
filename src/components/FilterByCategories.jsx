import React, { useState } from "react";

const categoryMap = {
  "All":"All",
  "Smartphone & Tablets": "Mobiles",
  "Laptop & Desktop": "Laptops",
  Headphones: "Headphones",
  "Smart Watches": "Smart Watches",
  "Drone & Camera": "Drone & Camera",
  "Top Selling Products": "Top Selling Products",
  "Electronic, TVs & More": "Electronic, TVs & More",
  "Virtual Reality Headsets": "Virtual Reality Headsets",
};

const FilterByCategories = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCheckboxChange = (category) => {
    const newSelection = selectedCategory === category ? "" : category;
    setSelectedCategory(newSelection);

    if (onFilterChange) {
      const mappedName = newSelection ? categoryMap[newSelection] : "";
      onFilterChange(mappedName ? [mappedName] : []);
    }
  };

  // Convert the object keys into an array to render checkboxes
  const categories = Object.keys(categoryMap);

  return (
    <div className="flex p-2 flex-col gap-2 w-full border rounded">
      <h2 className="text-lg text-black">Filter By Categories</h2>
      <div className="flex flex-col gap-1">
        {categories.map((category) => (
          <label
            key={category}
            className="gap-2 flex items-center text-[#4b5563] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategory === category}
              onChange={() => handleCheckboxChange(category)}
              className="w-4 h-4"
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterByCategories;
