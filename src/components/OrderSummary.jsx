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
        <table class="w-full border-collapse border-b-2">
          <tbody>
            <tr>
              <td class="p-2">Subtotal</td>
              <td class="p-2 text-center">1 item</td>
              <td class="p-2 text-right">$1,500</td>
            </tr>
            <tr>
              <td class="p-2">Discount</td>
              <td class="p-2 text-center">New customer</td>
              <td class="p-2 text-right text-red-500">-$1.00</td>
            </tr>
            <tr>
              <td class="p-2">Shipping</td>
              <td class="p-2 text-center">Free shipping</td>
              <td class="p-2 text-right">$0.00</td>
            </tr>
            <tr class=" border-gray-200 font-bold">
              <td class="p-2">Total</td>
              <td></td>
              <td class="p-2 text-right">$1,499</td>
            </tr>
          </tbody>
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
