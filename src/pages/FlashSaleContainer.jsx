import React from 'react'
import FlashSalePage from '../components/FlashSalePage'

const FlashSaleContainer = () => {
  return (
    <>
    <div className='flex flex-col  lg:flex-row px-3'>
      <FlashSalePage/>
      <FlashSalePage/>
    </div>
    </>
  )
}

export default FlashSaleContainer
