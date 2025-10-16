import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
import OrderContactForm from "./OrderContactForm";
import supabase from "../supabase";

const OrderPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data?.user ?? null);
      if (!data?.user) {
        // If we came here directly, send to login
        navigate("/loginPage", {
          replace: true,
          state: { returnTo: "/order" },
        });
      }
      if (mounted) setChecking(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [navigate]);
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

  const [submittedAddress, setSubmittedAddress] = useState(() => {
    const savedAddress = JSON.parse(localStorage.getItem("orderinfo")) || [];
    return savedAddress.length ? savedAddress[savedAddress.length - 1] : null;
  }); // track submitted form

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0; // or calculate based on delivery method if needed

  const order = {
    user_id: user?.id || "",
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
      {checking && <div className="text-center text-gray-500">Loading...</div>}
      {!checking && !user && null}
      {!checking && user && (
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
      )}
    </div>
  );
};

export default OrderPage;
