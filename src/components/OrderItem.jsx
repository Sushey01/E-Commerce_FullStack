import { ChevronDown, Trash } from 'lucide-react'
import Iphone from "../assets/images/iphone.webp"
import React from 'react'

const OrderItem = () => {
  return (
    <div className='p-2' >
      <div className='flex justify-between p-3'>
        <p>Order Item</p>
        <ChevronDown/>
      </div>
      <button className='border rounded-full p-1.5 text-red-300 bg-red-200'>Unfulfilled</button>
      <p>Use this personalized guide to get your store up and running.</p>
      <div className='flex justify-between'>
        <div className='flex gap-1'>
            <img src={Iphone} className='w-12 h-12'/>
            <div className='flex flex-col gap-1'>
                <p>Laptop</p>
                <p className='text-base'>Macbook Air</p>
                <p className='pt-2'>Medium Black</p>
            </div>
        </div>
        <div className='flex gap-1'>
        <button className='border rounded-sm'>
            <p>3 * $500.00</p>
        </button>
        <button><p>$1,500.00</p></button>
        <Trash className='flex self-center'/>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
