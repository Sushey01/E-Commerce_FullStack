import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
import OrderContactForm from "./OrderContactForm";





const TEMP_USER_ID = "aa62b313-11dc-400d-aad3-a476c328a0d5";


const OrderPage = () => {



  // // Add a new address
  // function addAddress(address){
  //   // Read addresses
  //   const savedAddress = JSON.parse(localStorage.getItem("orderinfo")) || [];
  //   const updated = [...savedAddress, address];
  //   localStorage.setItem("orderinfo", JSON.stringify(updated));
  //   setSubmittedAddress(address); //show the latest one
  // }


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
    user_id: TEMP_USER_ID,
    items: selectedItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
    discount: 0,
    paid: 0,
    status: "Pending",
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Column */}
        <div className="flex flex-col w-full lg:w-2/3 gap-4">
          <OrderContactForm />

          {/* Order Item(s) */}
          <OrderItem items={selectedItems} />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          <OrderSummary
            order={order}
            disableCheckout={!submittedAddress} // pass flag to disable checkout
          />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
