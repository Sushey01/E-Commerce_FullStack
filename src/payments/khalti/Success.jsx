import React from "react";

export default function Success() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            color: "#16a34a",
            marginBottom: "10px",
          }}
        >
          🎉 Payment Successful!
        </h1>

        <p style={{ marginBottom: "20px", color: "#444", fontSize: "16px" }}>
          Your payment has been completed successfully.
        </p>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Thank you for your purchase! We will process your order shortly.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#16a34a",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
