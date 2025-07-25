import React from 'react'
import FlashSalePage from '../components/FlashSalePage'

const FlashSaleContainer = () => {
  return (
    <>
    <div className='md:flex gap-3 py-2 px-4'>
      <FlashSalePage/>
      <FlashSalePage/>
    </div>
    </>
  )
}

export default FlashSaleContainer
