  import React, { useState, useEffect } from "react";
  import { useLocation } from "react-router-dom";
  import { CircleCheck, EllipsisVertical } from "lucide-react";
  import { createOrder } from "../supabase/orders";

  // Example fallback timeline
  const defaultTimeline = [
    {
      status: "Order confirmed",
      desc: "Order placed and confirmed",
      date: new Date().toISOString(),
    },
    {
      status: "Package prepared",
      desc: "Packed and handed to courier",
      date: new Date().toISOString(),
    },
    {
      status: "In transit",
      desc: "Package in transit",
      date: new Date().toISOString(),
    },
    {
      status: "Out for delivery",
      desc: "Will be delivered soon",
      date: new Date().toISOString(),
    },
  ];

  const OrderSuccessDetail = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-600">No order details found.</p>
        </div>
      );
    }

    const {
      id,
      items = [],
      subtotal = 0,
      shipping = 0,
      discount = 0,
      status,
      created_at,
      customer_name = "Guest User",
      customer_email = "N/A",
      timeline = defaultTimeline,
    } = order;

    // 1️⃣ Calculate total first
    const total = subtotal + shipping - discount;

    // 2️⃣ Generate order ID
    const orderId = id || Math.floor(100000 + Math.random() * 900000);

    // 3️⃣ Prepare order data
    const orderData = {
      order_number: orderId,
      customer_name,
      customer_email,
      subtotal,
      shipping,
      discount,
      total,
    };

    // 4️⃣ Use provided date or now
    const createdDate = created_at ? new Date(created_at) : new Date();

    // Delivery steps
    const deliverySteps = ["Pending", "Shipped", "Delivered"];
    const [currentStep, setCurrentStep] = useState(0);

    // 5️⃣ Save order to Supabase
    const [saved, setSaved] = useState(false);

    useEffect(() => {
      if (!saved && items.length > 0) {
        createOrder(orderData, items)
          .then((savedOrder) => {
            if (savedOrder) {
              console.log("Order saved successfully:", savedOrder);
              setSaved(true);
            }
          })
          .catch((err) => console.error("Failed to save order:", err));
      }
    }, [saved]);

    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="flex sm:items-center justify-between border-b pb-4">
          <div>
            <p className="text-lg font-semibold">Order #{orderId}</p>
            <p className="text-sm text-gray-500">
              {createdDate.toLocaleDateString()} • ${total.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <button className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-md">
              <CircleCheck className="text-green-600 w-4 h-4" />
              <span className="text-green-600 text-sm font-medium">Paid</span>
            </button>
            <EllipsisVertical className="text-gray-500" />
          </div>
        </div>

        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-800">Order Summary</h3>
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-700">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items in this order.</p>
            )}

            {/* Totals */}
            <div className="space-y-1 text-sm text-gray-600 mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right: Customer Info + Timeline */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Customer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white">
                  {customer_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{customer_name}</p>
                  <p className="text-sm text-gray-500">{customer_email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
              <div className="space-y-3">
                {timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CircleCheck className="text-green-500 w-4 h-4 mt-1" />
                    <div>
                      <p className="font-medium text-gray-700">{step.status}</p>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(step.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* {currentStep < deliverySteps.length - 1 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition"
                >
                  Mark as {deliverySteps[currentStep + 1]}
                </button>
              )}
              {currentStep === deliverySteps.length - 1 && (
                <p className="mt-4 text-green-600 font-semibold">
                  Order Delivered ✅
                </p>
              )} */}

              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-md shadow-md transition"
                  onClick={() => console.log("Track order clicked")} // placeholder for now
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default OrderSuccessDetail;
