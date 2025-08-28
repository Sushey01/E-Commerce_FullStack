import { ChevronDown } from "lucide-react";
import React from "react";

const OrderSummary = () => {
  return (
    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">Order Summary</p>
        <ChevronDown size={18} className="text-gray-500" />
      </div>

      {/* Status Badge */}
      <span className="inline-block border rounded-full px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100">
        Payment Pending
      </span>

      <p className="text-sm text-gray-500">
        Use this personalized guide to get your store up and running.
      </p>

      {/* Order Breakdown */}
      <div className="overflow-x-auto">
        <table className="w-full border-b">
          <tbody>
            <tr className="border-t">
              <td className="p-2 text-gray-700">Subtotal</td>
              <td className="p-2 text-center text-sm text-gray-500">1 item</td>
              <td className="p-2 text-right font-medium">$1,500.00</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 text-gray-700">Discount</td>
              <td className="p-2 text-center text-sm text-gray-500">
                New customer
              </td>
              <td className="p-2 text-right text-red-500 font-medium">
                - $1.00
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-2 text-gray-700">Shipping</td>
              <td className="p-2 text-center text-sm text-gray-500">
                Free shipping
              </td>
              <td className="p-2 text-right font-medium">$0.00</td>
            </tr>
            <tr className="border-t font-semibold">
              <td className="p-2">Total</td>
              <td></td>
              <td className="p-2 text-right">$1,499.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Info */}
      <div className="flex justify-between text-sm text-gray-700">
        <p>Paid by customer</p>
        <p className="font-medium">$0.00</p>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <p>Payment due when invoice is sent</p>
        <button className="text-purple-700 font-medium hover:underline">
          Edit
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 flex justify-between items-center bg-white border rounded-md">
        <p className="md:text-sm text-xs text-gray-600 max-w-md">
          Review your order at a glance on the Order Summary page.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md bg-white text-xs md:text-sm">
            Send invoice
          </button>
          <button className="px-4 py-2 rounded-md bg-purple-700 text-white text-xs md:text-sm">
            Collect payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
