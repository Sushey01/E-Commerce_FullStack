import React, { useEffect } from "react";
import Login from "../login/LoginDesk";
import LoginMob from "../login/LoginMob";
import supabase from "../supabase";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (user) {
        const returnTo = location.state?.returnTo;
        const selectedItems = location.state?.selectedItems;
        if (returnTo) {
          if (returnTo === "/order") {
            navigate("/order", {
              replace: true,
              state: { selectedItems: selectedItems || [] },
            });
          } else {
            navigate(returnTo, { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      }
    })();
  }, [location.state, navigate]);
  return (
    <div className="flex justify-center items-center my-8 md:my-0  p-4 md:p-10">
      {/* Desktop/tablet view: show both components */}
      <div className="hidden md:flex w-full max-w-5xl">
        <div className="w-1/2">
          <Login />
        </div>
        <div className="w-1/2">
          <LoginMob />
        </div>
      </div>

      {/* Mobile view: show only LoginMob */}
      <div className="block md:hidden w-full max-w-md">
        <LoginMob />
      </div>
    </div>
  );
};

export default LoginPage;
