import React from 'react'
import FlashSalePage from '../components/FlashSalePage'

const FlashSaleContainer = () => {
  return (
    <>
    <div className='flex flex-col md:flex-row lg:flex-row px-3'>
      <FlashSalePage/>
      <FlashSalePage/>
    </div>
    </>
  )
}

export default FlashSaleContainer
