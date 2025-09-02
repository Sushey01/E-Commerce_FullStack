import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
import OrderContactForm from "./OrderContactForm";

const OrderPage = () => {



  // Add a new address
  function addAddress(address){
    // Read addresses
    const savedAddress = JSON.parse(localStorage.getItem("orderinfo")) || [];
    const updated = [...savedAddress, address];
    localStorage.setItem("orderinfo", JSON.stringify(updated));
    setSubmittedAddress(address); //show the latest one
  }


  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [submittedAddress, setSubmittedAddress] = useState(()=>{
    const savedAddress = JSON.parse(localStorage.getItem("orderinfo"))|| [];
    return savedAddress.length?savedAddress[savedAddress.length -1]: null;
  }); // track submitted form

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0; // or calculate based on delivery method if needed

  const order = {
    items: selectedItems,
    subtotal,
    shipping,
    discount: 0,
    paid: 0,
    status: "Pending",
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-3 w-full">
        <div className="flex flex-col w-[65%] gap-4">
          {/* Contact Form */}
          {!submittedAddress ? (
            <OrderContactForm onSubmit={(data) => addAddress(data)} defaultValues={submittedAddress} />
          ) : (
            <div className="p-2 flex flex-col w-full bg-gray-100 border rounded-md">
              <h3 className="font-semibold">Shipping Address</h3>
              <p>
                {submittedAddress.firstname} {submittedAddress.lastname}
              </p>
              <p>{submittedAddress.phonenumber}</p>
              <p>
                {submittedAddress.address}, {submittedAddress.city},{" "}
                {submittedAddress.country}, {submittedAddress.postalno}
              </p>
              <button
                className="text-blue-500 mt-2"
                onClick={() => setSubmittedAddress(null)}
              >
                Edit
              </button>
            </div>
          )}

          {/* Order Item(s) */}
          <OrderItem items={selectedItems} />
        </div>

        <div className="w-[35%]">
          {/* <OrderProfileSection /> */}

          <OrderSummary
            order={
              order
            }
            disableCheckout={!submittedAddress} // pass flag to disable checkout
          />
         
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
