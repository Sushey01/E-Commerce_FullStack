import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../supabase/orders";
import { toast } from "react-toastify";

const OrderSummary = ({ order, disableCheckout }) => {
  const navigate = useNavigate();



  const handleCheckout = async () => {
    if (!orderState.items?.length) {
      toast.error("No items in order");
      return;
    }

    try {
      // Call createOrder to insert the order and order_items
      const newOrder = await createOrder(orderState, orderState.items);
      if (!newOrder) throw new Error("Order creation failed");

      toast.success("Order created successfully!");

      // Navigate to payment page with the real order
      navigate("/payment", { state: { order: newOrder } });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to create order: " + err.message);
    }
  };

  



  // Example: dynamic state for voucher
  const [orderState, setOrderState] = useState(order);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(order.discount || 0);

  const handleApplyVoucher = () => {
    // if (voucher === "WELCOME10") {
    //   setDiscount(10);
    // } else {
    //   setDiscount(0);
    // }

   const discountValue = voucher === "WELCOME10" ? 10 : 0;
   setDiscount(discountValue);

    // Update orderState so FinalOrderSummary reflect it
    setOrderState({
      ...orderState,
      discount: discountValue,
    });
  };

  const handleSendInvoice =()=>{
    navigate("/invoice", {state:{order:orderState}})
  }

 

  const subtotal = Number(orderState.subtotal || 0);
  const shipping = Number(orderState.shipping || 0);
  const total = subtotal - Number(orderState.discount || 0) + shipping;


  return (
    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">Order Summary</p>
        <ChevronDown size={18} className="text-gray-500" />
      </div>

      {/* Status Badge */}
      <span className="inline-block border rounded-full px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100">
        {order.status}
      </span>

      <p className="text-sm text-gray-500">
        Use this personalized guide to get your store up and running.
      </p>

      {/* Order Breakdown */}
      <div className="overflow-x-auto">
        <table className="w-full border-b">
          <tbody>
            <tr className="border-t">
              <td className="p-2 text-sm text-gray-700">Subtotal</td>
              <td className="p-2 text-center text-sm text-gray-500">
                {order.items?.length || 0} items
              </td>
              <td className="p-2 text-right text-sm font-medium">
                ${subtotal.toFixed(2)}
              </td>
            </tr>

            {discount > 0 && (
              <tr className="border-t">
                <td className="p-2 text-gray-700">Discount</td>
                <td className="p-2 text-center text-sm text-gray-500">
                  Voucher applied
                </td>
                <td className="p-2 text-right text-red-500 font-medium">
                  - ${discount.toFixed(2)}
                </td>
              </tr>
            )}

            <tr className="border-t">
              <td className="p-2 text-sm text-gray-700">Shipping</td>
              <td className="p-2 text-center text-sm text-gray-500">
                {shipping === 0 ? "Free shipping" : ""}
              </td>
              <td className="p-2 text-right text-sm font-medium">
                ${shipping.toFixed(2)}
              </td>
            </tr>

            {/* Voucher input */}
            <tr>
              <td colSpan={3} className="p-2 text-sm">
                <div className="flex gap-2">
                  <input
                    className="border p-2 flex-1"
                    placeholder="Enter Voucher Code"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                  <button
                    className="border bg-sky-500 text-white p-2"
                    onClick={handleApplyVoucher}
                  >
                    Apply
                  </button>
                </div>
              </td>
            </tr>

            <tr className="border-t font-semibold">
              <td className="p-2">Total</td>
              <td></td>
              <td className="p-2 text-right">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Info */}
      <div className="flex justify-between text-sm text-gray-700">
        <p>Paid by customer</p>
        <p className="font-medium">${order.paid || 0}</p>
      </div>

      {/* <div className="flex justify-between text-sm text-gray-700">
        <p>Payment due when invoice is sent</p>
        <button
        onClick={()=>{

        }}
        className="text-purple-700 font-medium hover:underline">
          Edit
        </button>
      </div> */}

      {/* Bottom Actions */}
      <div className="p-4 flex justify-between items-center bg-white border rounded-md">
        <p className=" text-xs text-gray-600 max-w-md">
          Review your order.
        </p>
        <div className="flex gap-2">
          <button
          onClick={handleSendInvoice}
          className="px-4 py-2  border rounded-md bg-white text-xs ">
            Send invoice
          </button>
          <button
          disabled={disableCheckout}
            className="px-6 py-2 rounded-md bg-purple-700 text-white text-sm "
            onClick= {handleCheckout}
          >
            Proceed to payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
