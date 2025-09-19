import React from 'react'

const FilterByBrands = () => {
  return (
    <>
       <div className="flex p-2 flex-col gap-2 ">
        <h2 className="text-lg text-black">Filter By Brands</h2>
       <div className="flex flex-col gap-1">
         <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Apple
        </label>
        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Samsung
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Dell
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Asus
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Acer
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Lenovo
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          SanDisk
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          Canon
        </label>

        <label className="gap-2 flex text-[#4b5563]">
          <input type="checkbox" />
          DIGICOM
        </label>
       </div>
      </div>
    </>
  )
}

export default FilterByBrands
