import React from 'react'
import CartPage from '../components/CartPage'
import OrderSummary from '../components/OrderSummary'

const OrderCart = () => {
  return (
    <div className='flex gap-2 p-4'>
      <CartPage/>
      <OrderSummary/>
    </div>
  )
}

export default OrderCart
