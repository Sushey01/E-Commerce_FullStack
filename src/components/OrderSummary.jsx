import { ChevronDown } from 'lucide-react';
import React from 'react'

const OrderSummary = () => {
  return (
    <div className="p-3 border rounded-sm bg-gray-100">
      <div className="flex justify-between p-3">
        <p>Order Summary</p>
        <ChevronDown />
      </div>
      <button className="border rounded-full p-1.5 text-yellow-300 bg-yellow-200">
        Payment pending
      </button>
      <p>Use this personalized guide to get your store up and running.</p>
      <div className="grid">
        <table className="border-b-2">
          <tr>
            <td>Subtotal</td>
            <td>1 item</td>
            <td>$1,500</td>
          </tr>

          <tr>
            <td>Discount</td>
            <td>Customer</td>
            <td>-$1.00</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td>Free shipping</td>
            <td>$0.00</td>
          </tr>
          
        </table>
      </div>
      <div className="flex justify-between">
        <p>Paid by customer</p>
        <p>$0.00</p>
      </div>
      <div className="flex justify-between">
        <p>Paid due when invoice is sent</p>
        <p>Edit</p>
      </div>
      <div className="p-4 flex justify-between">
        <p>Review your order at a glance on the Order Summary page.</p>
        <div className="flex gap-2">
          <button className="p-2 border rounded-md bg-white">
            <p>Send invoice</p>
          </button>
          <button className="bg-purple-700 border rounded-md p-2">
            <p>Collect payment</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary
