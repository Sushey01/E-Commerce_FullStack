import React from 'react'

const FilterByColor = () => {
  return (
    <>
      <div className='flex flex-col py-2 gap-3'>
        <h2 className="text-lg text-black">Filter By Color</h2>
        <div className='flex flex-wrap flex-col gap-2'>
            <div className='flex flex-wrap gap-2'>
                <button className='border rounded-full w-8 h-8 bg-purple-700'></button>
            <button className='border rounded-full w-8 h-8 bg-teal-500'></button>
            <button className='border rounded-full w-8 h-8 bg-green-600'></button>
            <button className='border rounded-full w-8 h-8 bg-red-600'></button>
            </div>
            <div className='flex flex-wrap gap-2'>
                 <button className='border rounded-full w-8 h-8 bg-red-800'></button>
            <button className='border rounded-full w-8 h-8 bg-yellow-700'></button>
            <button className='border rounded-full w-8 h-8 bg-teal-400'></button>
            <button className='border rounded-full w-8 h-8 bg-purple-500'></button>
            </div>
            
           
        </div>
      </div>
    </>
  )
}

export default FilterByColor
