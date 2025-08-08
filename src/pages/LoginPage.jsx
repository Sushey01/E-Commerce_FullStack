import React from "react";
import Login from "../login/LoginDesk";
import LoginMob from "../login/LoginMob";

const LoginPage = () => {
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
