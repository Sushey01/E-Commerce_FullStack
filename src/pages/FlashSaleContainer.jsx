import React from 'react'
import FlashSalePage from '../components/FlashSalePage'

const FlashSaleContainer = () => {
  return (
    <>
  <div className="flex flex-col lg:flex-row px-2 max-w-full overflow-hidden pb-5">
  <FlashSalePage />
  <FlashSalePage />
</div>
    </>
  )
}

export default FlashSaleContainer
