import Esewa from "../assets/images/esewa.png";
import Credit from "../assets/images/credit.png";
import Cod from "../assets/images/cod.png";
import Khalti from "../assets/images/khalti.avif";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinalOrderSummary from "./FinalOrderSummary";

const CheckoutPayment = ({selectedItems = []}) => {
  const location = useLocation();
     const order = location.state?.order || {
       items: [],
       subtotal: 0,
       shipping: 0,
       discount: 0,
       paid: 0,
       status: "Pending",
     };

    

    
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

   const navigate = useNavigate();

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      description: "Credit/Debit Card",
      image: Credit,
      color: "bg-blue-50 border-blue-200",
      instructions: [
        "Enter your 16-digit card number",
        "Provide expiry date (MM/YY) and CVV",
        "Enter cardholder name as on card",
        "Complete 3D Secure authentication if prompted",
      ],
    },
    {
      id: "esewa",
      name: "eSewa Mobile Wallet",
      description: "eSewa Mobile Wallet",
      image: Esewa,
      color: "bg-green-50 border-green-200",
      instructions: [
        "Login to your eSewa account using your credentials",
        "Verify your mobile number with OTP",
        "Ensure sufficient balance in your eSewa wallet",
        "Confirm payment details and complete transaction",
      ],
    },
    {
      id: "khalti",
      name: "Khalti by IME",
      description: "Mobile Wallet",
      image: Khalti,
      color: "bg-purple-50 border-purple-200",
      instructions: [
        "Login to your IME Pay account using your IME Pay ID and PIN",
        "Ensure your IME Pay account is active and has sufficient balance",
        "Enter OTP (one time password) sent to your registered mobile number",
        "Login with your IME Pay mobile and PIN",
      ],
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Cash on Delivery",
      image: Cod,
      color: "bg-orange-50 border-orange-200",
      instructions: [
        "Order will be delivered to your specified address",
        "Prepare exact amount in cash (Rs. 3,466)",
        "Payment will be collected upon delivery",
        "Delivery agent will provide receipt after payment",
      ],
    },
  ];

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
    setShowInstructions(true);
  };

  const handlePayNow = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    navigate("/success", {state:{order, payment:selectedPayment}})

    const selectedMethod = paymentMethods.find(
      (method) => method.id === selectedPayment
    );
    if (selectedPayment === "cod") {
      alert(
        "Order confirmed! Your item will be delivered and payment collected on delivery."
      );
    } else {
      alert(`Redirecting to ${selectedMethod.name} payment gateway...`);
    }
  };

  const selectedMethodData = paymentMethods.find(
    (method) => method.id === selectedPayment
  );

  return (
    <div className="bg-gray-100  min-h-screen p-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Notification Banner */}
        <div className="bg-yellow-100  border-l-4 w-[80%] border-yellow-500 p-4 mb-6 flex items-center gap-2">
          <div className="text-yellow-800 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
            !
          </div>
          <p className="text-sm text-yellow-700">
            Ensure you have collected the payment voucher to get Bank and Wallet
            Discounts. 0% EMI available on selected bank partners.
          </p>
        </div>

        {/* Main Flex Row */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left: Payment Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Select Payment Method
            </h2>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentSelect(method.id)}
                    className={`
                      border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all duration-200 hover:shadow-md
                      ${
                        isSelected
                          ? `${method.color} border-blue-400 ring-2 ring-blue-500 ring-opacity-50`
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <img
                      src={method.image}
                      alt={method.name}
                      className="w-12 h-12 mb-2"
                    />
                    <p className="text-sm font-bold text-center">
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {method.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Payment Instructions */}
            {showInstructions && selectedMethodData && (
              <div className="border-t pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Payment Instructions - {selectedMethodData.name}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    *You will be redirected to complete your payment:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {selectedMethodData.instructions.map(
                      (instruction, index) => (
                        <li key={index}>{instruction}</li>
                      )
                    )}
                  </ol>
                  {selectedPayment === "khalti" && (
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      ***Login with your IME Pay mobile and PIN***
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handlePayNow}
              disabled={!selectedPayment}
              className={`
                py-2 px-6 rounded-lg w-full sm:w-auto font-semibold transition-all duration-200
                ${
                  selectedPayment
                    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {selectedPayment ? "Pay Now" : "Select Payment Method"}
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <FinalOrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
