import React from "react";
import KhaltiButton from "./KhaltiButton";

const KhaltiTestPage = () => {
  return (
    <div className="p-6">
      <h1>Khalti Checkout JS Test</h1>
      <KhaltiButton amount={5000} />
    </div>
  );
};

export default KhaltiTestPage;
