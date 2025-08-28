import React from 'react'
import OrderContactForm from './OrderContactForm'
import OrderSummary from '../components/OrderSummary'
import OrderItem from '../components/OrderItem'

const OrderCartPaymentProcess = () => {
  return (
    <div className='p-4 flex flex-col gap-3'>
        <div className='flex gap-2'>
      <OrderContactForm/>
      <OrderSummary/>
        </div>
        <div className='w-1/2'>
        <OrderItem/>
        </div>
    </div>
  )
}

export default OrderCartPaymentProcess
