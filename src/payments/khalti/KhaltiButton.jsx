import React, { useEffect } from "react";

const ENABLE_KHALTI = import.meta.env.VITE_ENABLE_KHALTI === "true";
const KHALTI_PUBLIC_KEY = import.meta.env.VITE_KHALTI_PUBLIC_KEY ?? "";

const KhaltiButton = ({ amount = 5000 }) => {
  // If Khalti is disabled via env, render a disabled button
  if (!ENABLE_KHALTI || !KHALTI_PUBLIC_KEY) {
    return (
      <button disabled className="bg-gray-300 text-gray-700 px-4 py-2 rounded mt-3">
        Khalti Disabled
      </button>
    );
  }

  useEffect(() => {
    // Dynamically load Khalti checkout script
    if (!window.KhaltiCheckout) {
      const script = document.createElement("script");
      script.src = "https://khalti.com/static/khalti-checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    try {
      // 1️⃣ Prepare payload for your Supabase Edge Function
      const payload = {
        amount, // in paisa
        product_identity: "12345",
        product_name: "Test Product",
        customer_phone: "9800000000",
      };

      // 2️⃣ Call Supabase Edge Function to get Khalti token
      const response = await fetch(
        "https://aiydcufyvumdsaksbggr.supabase.co/functions/v1/create_payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // replace with your project anon key
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.text();
        console.error("Error from server:", errData);
        alert("Failed to get payment token from server");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        console.error("Invalid token from server:", data);
        alert("Failed to get payment token from server");
        return;
      }

      // 3️⃣ Configure Khalti checkout
      const config = {
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: payload.product_identity,
        productName: payload.product_name,
        productUrl: window.location.origin,
        eventHandler: {
          onSuccess(payload) {
            console.log("Payment Success!", payload);
            // Redirect to success page
            window.location.href = "/khalti-test"; // your success page
          },
          onError(error) {
            console.error("Payment Failed:", error);
            alert("Payment failed. Check console for details.");
          },
          onClose() {
            console.log("Payment widget closed");
          },
        },
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
      };

      // 4️⃣ Open Khalti checkout
      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ token: data.token, amount });
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("Error initiating payment. Check console.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-purple-600 text-white px-4 py-2 rounded mt-3"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiButton;
