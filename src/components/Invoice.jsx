import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order from state
  const order = location.state?.order;
  if (!order) return <p>No order data found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>

      <p>Status: {order.status}</p>
      <p>Items: {order.items.length}</p>
      <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
      <p>Discount: ${order.discount.toFixed(2)}</p>
      <p>Shipping: ${order.shipping.toFixed(2)}</p>
      <p className="font-bold">
        Total: ${order.subtotal - order.discount + order.shipping}
      </p>

      <div className="mt-6 flex gap-2">
        <button
          className="px-4 py-2 bg-purple-700 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => window.print()} // simple print solution
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
