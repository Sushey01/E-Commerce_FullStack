import React from 'react'

const ThisMonthSaleShowCaseOptions = () => {
    const options = ['All Products', 'Electronics', 'Fashion', 'Home Appliances', 'Books', 'Toys']
  return (
    <div className='flex gap-1'>
<button className='rounded-3xl p-3 items-center bg-blue-600 hover:bg:blue-700'>{options.map((option, index) => (

<span key={index}>{option}</span>
) )}</button>
    </div>
  )
}

export default ThisMonthSaleShowCaseOptions
