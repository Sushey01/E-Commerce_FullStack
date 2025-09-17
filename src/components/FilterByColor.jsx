import React, { useState } from "react";

const colors = [
  { name: "purple-700", class: "bg-purple-700" },
  { name: "teal-500", class: "bg-teal-500" },
  { name: "green-600", class: "bg-green-600" },
  { name: "red-600", class: "bg-red-600" },
  { name: "red-800", class: "bg-red-800" },
  { name: "yellow-700", class: "bg-yellow-700" },
  { name: "teal-400", class: "bg-teal-400" },
  { name: "purple-500", class: "bg-purple-500" },
];

const FilterByColor = ({ onFilterChange }) => {
  const [selectedColors, setSelectedColors] = useState([]);

  const handleColorToggle = (colorName) => {
    const updatedColors = selectedColors.includes(colorName)
      ? selectedColors.filter((item) => item !== colorName)
      : [...selectedColors, colorName];
    setSelectedColors(updatedColors);
    if (onFilterChange) {
      console.log("Colors updated:", updatedColors);
      onFilterChange(updatedColors);
    }
  };

  return (
    <>
      <div className="flex flex-col py-2 gap-3">
        <h2 className="text-lg text-black">Filter By Color</h2>
        <div className="flex flex-wrap flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {colors.slice(0, 4).map(({ name, class: colorClass }) => (
              <button
                key={name}
                className={`border rounded-full w-8 h-8 ${colorClass} ${
                  selectedColors.includes(name) ? "ring-2 ring-blue-500" : ""
                } focus:outline-none`}
                onClick={() => handleColorToggle(name)}
                aria-label={`Select ${name}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.slice(4).map(({ name, class: colorClass }) => (
              <button
                key={name}
                className={`border rounded-full w-8 h-8 ${colorClass} ${
                  selectedColors.includes(name) ? "ring-2 ring-blue-500" : ""
                } focus:outline-none`}
                onClick={() => handleColorToggle(name)}
                aria-label={`Select ${name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterByColor;
