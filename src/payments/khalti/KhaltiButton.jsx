import React, { useEffect } from "react";

const KHALTI_PUBLIC_KEY = "03b8308d1f49449180cc43567acb9c32"; // replace with your test key

const KhaltiButton = ({ amount = 5000 }) => {
  useEffect(() => {
    // Make sure the Khalti object exists
    if (!window.KhaltiCheckout) {
      const script = document.createElement("script");
      script.src = "https://khalti.com/static/khalti-checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = () => {
    const config = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: "12345",
      productName: "Test Product",
      productUrl: "http://localhost:5173",
      eventHandler: {
        onSuccess(payload) {
          console.log("Payment Success!", payload);
          alert("Payment Success! Check console for payload.");
        },
        onError(error) {
          console.error("Payment Failed:", error);
          alert("Payment Failed. Check console.");
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

    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount }); // amount in paisa (e.g., 5000 = NPR 50)
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
