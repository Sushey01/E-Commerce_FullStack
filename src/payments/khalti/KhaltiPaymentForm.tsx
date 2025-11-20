import React from "react";
import { useKhalti } from "../../hooks/useKhalti";
import { useNavigate } from "react-router-dom";

interface KhaltiPaymentFormProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
}

const KhaltiPaymentForm = ({ product }: KhaltiPaymentFormProps) => {
  const navigate = useNavigate();

  const { initiate, initiationError, isLoading } = useKhalti({
    onSuccess: (response) => {
      navigate(`/success`, { state: { product, response } });
    },
    onError: (error) => {
      console.error("Payment error:", error.message);
    },
  });

  const handlePayment = () => {
    if (!product) return;

    const paymentRequest = {
      amount: product.price * 100,
      purchase_order_id: `order-${product.id}`,
      purchase_order_name: product.name,

      customer_info: {
        name: "John Doe", // ← Replace these with actual data
        email: "john@example.com",
        phone: "9800000000",
      },

      return_url: "http://localhost:5173/success",
      website_url: "http://localhost:5173/",
    };

    initiate(paymentRequest);
  };

  return (
    <div>
      {isLoading && <span>Processing payment...</span>}
      {initiationError && <span>Error: {initiationError.message}</span>}

      <button onClick={handlePayment} disabled={isLoading}>
        Pay Now with Khalti
      </button>
    </div>
  );
};

export default KhaltiPaymentForm;
