import React from 'react'
import MonthlySaleCard from './MonthlySaleCard'

const HomeProductFilterSort = () => {
  return (
    <>
      <div className='flex  flex-wrap justify-between p-3'>
        <p>Showing all 12 items</p>
        <div className='flex gap-3' >
            <div className='flex gap-2 items-center'>
               <p className='text-sm text-[#4b5563]'>Sort By:</p>
            <select className='border rounded bg-gray-200 text-sm px-2'>
                <option>Latest</option>
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price:High to Low</option>
            </select>
            </div>
            <div className=' flex gap-2 items-center'>
                <p className='text-sm text-[#4b5563] '>Show:</p>
                <select className='border rounded bg-gray-200 text-sm px-2'>
                    <option>12 Items</option>
                    <option>24 Items</option>
                    <option>36 Items</option>
                    <option>48 Items</option>
                </select>
            </div>

            <button className='border-none rounded p-1  hover:bg-gray-200'>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"></path></svg>
            </button>

            <button className='border bg-gray-200 rounded p-1 '>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"></path></svg>
            </button>
            
        </div>
      </div>
      <div className='grid grid-cols-4 py-2 gap-3'>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
        <MonthlySaleCard/>
    </div>
    </>
  )
}

export default HomeProductFilterSort
