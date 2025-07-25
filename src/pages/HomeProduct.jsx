import React from 'react'
import HomeProductFilterSort from '../components/HomeProductFilterSort'
import SideDropDown from '../ui/SideDropDown'
import HomeProductHead from '../ui/HomeProductHead'
import FilterByCategories from '../components/FilterByCategories'
import FilterProduct from './FilterProduct'

const HomeProduct = () => {
  return (
    <>

      <div className='w-full p-4 flex gap-3'>
        <div className='w-[25%] flex flex-col gap-2 '>
            
        <SideDropDown/>
        <FilterProduct/>
        </div>
        <div className='flex flex-col'>
            <HomeProductHead/>
            <HomeProductFilterSort/>
        </div>
      </div>
    </>
  )
}

export default HomeProduct
