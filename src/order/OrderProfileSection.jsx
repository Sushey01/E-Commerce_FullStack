import { ChevronDown, Edit3, Mail, Map, ShoppingBag, User } from 'lucide-react'
import React from 'react'

const OrderProfileSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded-md p-3">
        <div className="flex justify-between">
          <h1 className="text-sm">Notes</h1>
          <Edit3 />
        </div>
        <p>First customer and order !</p>
      </div>

      <div className="border flex flex-col rounded-md p-3">
        <div className="flex justify-between">
          <h1 className="text-sm">Customer</h1>
          <ChevronDown />
        </div>
        <div className="flex gap-1 ">
          <User />
          <p>Shekhar Magar</p>
        </div>

        <div className="flex gap-1">
          <ShoppingBag />
          <p>1 Order</p>
        </div>
        <p>Customer is tax-exempt</p>
      </div>

      <div className="border flex flex-col p-3">
        <div className="flex justify-between">
          <p>Contact Information</p>
          <Edit3 />
        </div>
        <div className="flex gap-1">
          <Mail />
          <p>fasttry3@gmail.com</p>
        </div>
        <p>No phone number</p>
      </div>

      <div className="border flex flex-col p-3">
        <div className="flex justify-between">
          <p>Shipping address</p>
          <Edit3 />
        </div>
        <div className="flex gap-1 ">
          <User />
          <p>Shekhar Magar</p>
        </div>
        <p>44600 Bhaisepati, Lalitpur</p>
        <p>Nepal Hero</p>
        <p>Nepal State</p>
        <p>+977-9881234757</p>
        <div className='pt-2 flex gap-1'>
            <Map className='text-purple-400'/>
            <p className='text-purple-400'>View Map</p>
        </div>
      </div>

      <div className='flex flex-col border rounded-md p-3'>
        <div className='flex justify-between'>
            <p>Billing address</p>
            <ChevronDown/>
        </div>
        <p>Same as shipping address</p>
      </div>
    </div>
  );
}

export default OrderProfileSection
