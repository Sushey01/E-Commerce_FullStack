import React from "react";

// Define the shape of the data the component expects
interface OrderData {
  numberOfProducts: number;
  customerName: string;
  sellerName: string;
  amount: number; // Stored as a number for cleaner manipulation if needed
  deliveryStatus: "Pending" | "Shipped" | "Delivered" | string;
  paymentMethod: "Wallet" | "Credit Card" | "PayPal" | string;
  paymentStatus: "Paid" | "Unpaid" | "Failed" | string;
}

// Define the props for the component
interface OrderDetailsProps {
  data: OrderData;
}

// Helper component for a single detail row
const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <span style={{ fontWeight: "bold", color: "#333" }}>{label}</span>
    <span style={{ color: "#555" }}>{value}</span>
  </div>
);

// Main OrderDetails component
const OrderDetails: React.FC<OrderDetailsProps> = ({ data }) => {
  // Function to render the Payment Status with a visual indicator
  const renderPaymentStatus = (status: string) => {
    const isPaid = status === "Paid";
    const backgroundColor = isPaid ? "#4CAF50" : "#FF9800"; // Green for Paid, Orange for others
    const color = "white";

    return (
      <span
        style={{
          backgroundColor: backgroundColor,
          color: color,
          padding: "4px 8px",
          borderRadius: "4px",
          fontWeight: "bold",
          fontSize: "14px",
          display: "inline-block",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Order Information</h2>
      <DetailRow label="Num. of Products" value={data.numberOfProducts} />
      <DetailRow label="Customer" value={data.customerName} />
      <DetailRow label="Seller" value={data.sellerName} />
      {/* Format the amount to USD currency string */}
      <DetailRow label="Amount" value={`$${data.amount.toFixed(3)}`} />
      <DetailRow label="Delivery Status" value={data.deliveryStatus} />
      <DetailRow label="Payment method" value={data.paymentMethod} />
      <DetailRow
        label="Payment Status"
        value={renderPaymentStatus(data.paymentStatus)}
      />
    </div>
  );
};

export default OrderDetails;

// --- Example Usage ---
/*
  const sampleOrderData: OrderData = {
    numberOfProducts: 1,
    customerName: 'Paul K. Jensen',
    sellerName: 'Pink Horizon',
    amount: 31.800, // Storing as a number; use 31.80 for $31.80
    deliveryStatus: 'Pending',
    paymentMethod: 'Wallet',
    paymentStatus: 'Paid',
  };

  // In another component:
  // <OrderDetails data={sampleOrderData} />
*/
