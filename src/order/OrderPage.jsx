import React from 'react'
import OrderItem from '../components/OrderItem'
import OrderSummary from '../components/OrderSummary';

const OrderPage = () => {
  return (
    <div className="p-4">
      <div className="flex gap-3">
        <h1>Order ID: 334902445</h1>
        <button className="bg-yellow-200  text-yellow-300 border p-1.5 rounded-full">
          Payment pending
        </button>
        <button className="bg-red-200 text-red-300 border p-1.5 rounded-full">
          Unfulfilled
        </button>
      </div>
      <p>January 8, 2024 at 9:48 pm from Draft Orders</p>
      <OrderItem />
      <div className='p-4 flex justify-between border rounded-sm bg-gray-200'>
        <p>Effortlessly manage your orders with out intuitive Order List Page.</p>
        <div className='flex gap-2'>

        <button className='p-2 border rounded-md bg-white'>
        <p>Fulfill item</p>
        </button>
        <button className='bg-purple-700 border rounded-md p-2'>
            <p>Create shipping label</p>
        </button>
        </div>
      </div>
      <OrderSummary/>
    </div>
  );
}

export default OrderPage
