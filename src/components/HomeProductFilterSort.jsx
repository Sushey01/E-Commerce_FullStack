import React from 'react'
import MonthlySaleCard from './MonthlySaleCard'

const HomeProductFilterSort = ({onFilterClick}) => {
  return (
    <>
      {/* Filter & Sort Bar */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between py-3 px-1 gap-3'>
        <p className='text-sm'>Showing all 12 items</p>

        {/* Controls wrapper: stacked on mobile, row on tablet and up */}
        <div className='flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-3 w-full md:w-auto'>

          {/* Sort & Show Controls */}
          <div className='flex flex-wrap justify-between md:gap-2 lg:gap-4'>
            {/* Sort By */}
            <div className='flex gap-2 items-center'>
              <p className='text-sm text-[#4b5563]'>Sort By:</p>
              <select className='border rounded bg-gray-200 text-sm px-2 py-1'>
                <option>Latest</option>
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Show Count */}
            <div className='flex gap-2 items-center'>
              <p className='text-sm text-[#4b5563]'>Show:</p>
              <select className='border rounded bg-gray-200 text-sm px-2 py-1'>
                <option>12 Items</option>
                <option>24 Items</option>
                <option>36 Items</option>
                <option>48 Items</option>
              </select>
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className='flex gap-2 items-center'>
            <button className='border-none rounded p-1 hover:bg-gray-200'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
              </svg>
            </button>
            <button className='border bg-gray-200 rounded p-1'>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
              </svg>
            </button>
            <button className='flex md:hidden lg:hidden' onClick={onFilterClick}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Filter"><path d="M14.037,20.937a1.015,1.015,0,0,1-.518-.145l-3.334-2a2.551,2.551,0,0,1-1.233-2.176V12.091a1.526,1.526,0,0,0-.284-.891L4.013,4.658a1.01,1.01,0,0,1,.822-1.6h14.33a1.009,1.009,0,0,1,.822,1.6h0L15.332,11.2a1.527,1.527,0,0,0-.285.891v7.834a1.013,1.013,0,0,1-1.01,1.012ZM4.835,4.063,9.482,10.62a2.515,2.515,0,0,1,.47,1.471v4.524a1.543,1.543,0,0,0,.747,1.318l3.334,2,.014-7.843a2.516,2.516,0,0,1,.471-1.471l4.654-6.542,0,0Z"></path></g></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-2 gap-3'>
        {Array.from({ length: 12 }).map((_, idx) => (
          <MonthlySaleCard key={idx} />
        ))}
      </div>
    </>
  )
}

export default HomeProductFilterSort
