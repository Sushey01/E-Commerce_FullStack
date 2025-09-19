import React, { useState, useEffect } from "react";

const brandsMap = {
  All: "All",
  Apple: "Apple",
  Samsung: "Samsung",
  Dell: "Dell",
  Asus: "Asus",
  Acer: "Acer",
  Lenovo: "Lenovo",
  SanDisk: "SanDisk",
  Canon: "Canon",
  Digicom: "Digicom",
};

const FilterByBrands = ({ selectedBrands = [], onFilterChange }) => {
  const [selected, setSelected] = useState(selectedBrands);

  useEffect(() => {
    setSelected(selectedBrands);
  }, [selectedBrands]);

  const handleBrandToggle = (brand) => {
    let updated;
    if (selected.includes(brand)) {
      updated = selected.filter((b) => b !== brand);
    } else {
      updated = [...selected, brand];
    }
    setSelected(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const brands = Object.keys(brandsMap);

  return (
    <div className="flex p-2 flex-col gap-2">
      <h2 className="text-lg text-black">Filter By Brands</h2>
      <div className="flex flex-col gap-1">
        {brands.map((bra) => (
          <label
            key={bra}
            className="gap-2 flex items-center text-[#4b5563] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(bra)}
              onChange={() => handleBrandToggle(bra)}
              className="w-4 h-4"
            />
            {bra}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterByBrands;
