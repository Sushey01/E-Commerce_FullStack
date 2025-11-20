import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const purchaseOrderName = searchParams.get("purchase_order_name") || "";
    const amount = searchParams.get("amount") || ""; // This will be in paisa
    const transactionId = searchParams.get("transaction_id") || "";
    const mobile = searchParams.get("mobile") || "";
    const status = searchParams.get("status")||"";

  return (
    <div>
      <h1>Payment {status}</h1>
      <div>
        <p>Order:{purchaseOrderName}</p>
        <p>Amount:NPR {Number(amount) / 100}</p> {/* converting paisa to NPR */}
        <p>Transaction ID: {transactionId}</p>
        <p>Mobile: {mobile}</p>
      </div>
    </div>
  );
}

export default SuccessPage
