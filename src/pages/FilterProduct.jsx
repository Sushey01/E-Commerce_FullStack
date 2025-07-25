import React from 'react'
import FilterByCategories from '../components/FilterByCategories'
import FilterByColor from '../components/FilterByColor'
import FilterByPrice from './FilterByPrice'
import FilterByBrands from '../components/FilterByBrands'
import FilterByProduct from '../components/FilterByProduct'

const FilterProduct = () => {
  return (
    <>
      <div className="flex p-2 flex-col gap-2 border rounded w-full">
        <FilterByCategories/>
        <FilterByColor/>
        <FilterByPrice/>
        <FilterByBrands/>
        <FilterByProduct/>
      </div>
    </>
  )
}

export default FilterProduct
