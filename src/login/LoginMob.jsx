import React from "react";
import Google from "../assets/images/google.png";
import Facebook from "../assets/images/facebook.png";
import { MdEmail } from "react-icons/md";
import LoginBg from "../assets/images/loginbg.jpg";

const LoginMob = () => {
  return (

      <div className="flex flex-col gap-3 p-4 border rounded-lg w-full ">
        <h1 className="text-2xl">Login in or sign up in seconds</h1>

        <p className="text-gray-500">
          Use your email or another services to continue with sowis.
        </p>

        <button className="border rounded-md bg-white p-1">
          <div className="flex gap-5 items-center ">
            <img src={Google} alt="google" className="w-7 h-7" />
            <p>Continue with Google</p>
          </div>
        </button>

        <button className="border rounded-md bg-white p-1">
          <div className="flex gap-5 items-center">
            <img src={Facebook} alt="facebook" className="w-5 h-5" />
            <p>Continue with Facebook</p>
          </div>
        </button>

        <button className="border rounded-md bg-white p-1">
          <div className="flex gap-5 items-center">
            <MdEmail className="w-5 h-5" />
            <p>Continue with Google</p>
          </div>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
          <input type="checkbox" />
          <p>
            By confirming the order, I accept the{" "}
            <span className="text-blue-600 underline cursor-pointer">
              terms of the user{" "}
            </span>
            agreement.
          </p>
        </div>
         <div className="flex gap-1 justify-center">
            <p>No account?</p>
            <p className="text-blue-600 text-base">Sign up</p>
        </div>
      </div>

  );
};

export default LoginMob;
