import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
// OrderContactForm removed per new flow: manage addresses in Address Book
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
  // const selectedItems = location.state?.selectedItems || [];


// Instead of storing selectedItems in localStorage, we can use zustand context as a state management.
// Lazy initializor = arrow function to avoid running on every render

  const [selectedItems, setSelectedItems] = useState(()=>{
    const fromState = location.state?.selectedItems;
    if (fromState && fromState.length>0) return fromState;

      const saved = localStorage.getItem("selectedItems");
      return saved ?JSON.parse(saved):[]
    
  })

  useEffect(() => {
    if (selectedItems.length>0){
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    }
  }, [selectedItems])

  const [submittedAddress, setSubmittedAddress] = useState(() => {
    const savedAddress = JSON.parse(localStorage.getItem("orderinfo")) || [];
    return savedAddress.length ? savedAddress[savedAddress.length - 1] : null;
  }); // track submitted form

  // Normalize rows that might be stored in old JSON shape
  const normalizeAddress = (a) => {
    if (!a) return null;
    const addr = a.address || {};
    const full_name =
      a.full_name ||
      [addr.firstname, addr.lastname].filter(Boolean).join(" ") ||
      a.label ||
      "";
    const phone = a.phone || addr.phonenumber || addr.phone || "";
    const line1 = a.line1 || addr.street || addr.address || "";
    const line2 = a.line2 || addr.landmark || "";
    const city = a.city || addr.city || "";
    const state = a.state || addr.province || addr.state || "";
    const postal_code =
      a.postal_code || addr.postal_code || addr.postalno || "";
    const country = a.country || addr.country || "";
    const is_default = a.is_default ?? false;
    return {
      id: a.id,
      user_id: a.user_id,
      full_name,
      phone,
      line1,
      line2,
      city,
      state,
      postal_code,
      country,
      is_default,
    };
  };

  // Load default or most recent address from Supabase when user is available
  const loadDefaultAddress = React.useCallback(async () => {
    if (!user) return;
    // Strictly fetch only the default address
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .order("created_at", { ascending: false })
      .limit(1);
    if (!error) {
      const normalized = normalizeAddress(data?.[0]);
      setSubmittedAddress(normalized ?? null);
    }
  }, [user]);

  useEffect(() => {
    loadDefaultAddress();
  }, [loadDefaultAddress]);

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
            {/* Shipping Address Card or CTA to manage addresses */}
            <div className="w-full md:w-2/3 lg:w-1/2">
              {submittedAddress ? (
                <div className="border rounded p-4 bg-white space-y-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-semibold">
                        {submittedAddress.full_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submittedAddress.is_default && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                          Default
                        </span>
                      )}
                      <button
                        onClick={() =>
                          navigate("/profile/address-book", {
                            state: { returnTo: "/order" },
                          })
                        }
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Change default
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>{submittedAddress.line1}</p>
                    {submittedAddress.line2 && <p>{submittedAddress.line2}</p>}
                    <p>
                      {submittedAddress.city}
                      {submittedAddress.state
                        ? `, ${submittedAddress.state}`
                        : ""}
                      {submittedAddress.country
                        ? `, ${submittedAddress.country}`
                        : ""}
                      {submittedAddress.postal_code
                        ? ` ${submittedAddress.postal_code}`
                        : ""}
                    </p>
                    {submittedAddress.phone && (
                      <p className="text-gray-500">
                        📞 {submittedAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border rounded p-4 bg-white shadow-sm">
                  <p className="text-sm text-gray-700 mb-2">
                    No shipping address selected. Add one and set it as Default
                    in your Address Book.
                  </p>
                  <button
                    onClick={() =>
                      navigate("/profile/address-book", {
                        state: { returnTo: "/order" },
                      })
                    }
                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
                  >
                    Manage Addresses
                  </button>
                </div>
              )}
            </div>

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
