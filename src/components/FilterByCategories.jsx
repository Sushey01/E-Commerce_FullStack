import React, { useEffect, useState } from "react";


const categories = [
  "Smartphone & Tablets",
  "Laptop & Desktop",
  "Headphones",
  "Smart Watches",
  "Drone & Camera",
  "Top Selling Products",
  "Electronic, TVs & More",
  "Virtual Reality Headsets"
];




const FilterByCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);


//  function handleCheckboxChange(category) {
//    if (selectedCategories.includes(category)) {
//      // Remove it
//      setSelectedCategories(
//        selectedCategories.filter((item) => item !== category)
//      );
//    } else {
//      // Add it
//      setSelectedCategories([...selectedCategories, category]);
//    }
//  }

const handleRadioChange=(category)=>{
  setSelectedCategories(category);
  if (onFilterChange){
    onFilterChange(category);
  }
}

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
                onChange={() => handleRadioChange(category)}
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
