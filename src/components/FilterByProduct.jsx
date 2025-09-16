import React, { useState } from 'react'


const products = [
  "In Stock",
  "On Sale",
  "Out of Stock",
];


const FilterByProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState([])


  const handleRadioChange =(category)=>{
    setSelectedProduct(category);
    if (onFilterChange){
      onFilterChange(category);
    }
  }

  return (
    <>
      <div className="flex p-2 flex-col gap-2 ">
        <h2 className="text-lg text-black">Product Status</h2>
        <div className="flex flex-col gap-1">
          {products.map((category) => (
            <label key={category} className="gap-2 flex text-[#4b5563]">
              <input
                type="checkbox"
                checked={selectedProduct.includes(category)}
                onChange={() => handleRadioChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

export default FilterByProduct
