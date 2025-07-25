import React from 'react'

const FilterByProduct = () => {
  return (
    <>
      <div className="flex p-2 flex-col gap-2 ">
        <h2 className="text-lg text-black">Filter By Brands</h2>
       <div className="flex flex-col gap-1">
         <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          In Stock
        </label>
        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          On Sale
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Out of Stock
        </label>
        </div>
        </div>
    </>
  )
}

export default FilterByProduct
