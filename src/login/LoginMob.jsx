import React from "react";
import Google from "../assets/images/google.png";
import Facebook from "../assets/images/facebook.png";
import { MdEmail } from "react-icons/md";
import LoginBg from "../assets/images/loginbg.jpg";

const LoginMob = () => {
  return (
    <div className="flex flex-col gap-3 p-6 px-10 border rounded-md md:rounded-tl-none md:rounded-bl-none w-full ">
      <h1 className="text-2xl text-center">Login in or sign up in seconds</h1>

      <p className="text-gray-500 text-sm text-center">
        Use your email or another services to continue with sowis.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="*******"
          className="border rounded px-2 py-1"
        />
      </div>

      <button
        className="bg-gray-400 flex border justify-center rounded-full px-8 py-1 hover:bg-gray-500"
        onClick={onsubmit}
      >
        <p className="text-gray-100 ">Sign in</p>
      </button>

      <button className="flex gap-1 justify-center">
        <p>No account?</p>
        <p className="text-blue-600 text-base">Sign up</p>
      </button>

      <button className="border rounded-md bg-white p-1">
        <div className="flex gap-5 justify-center">
          <MdEmail className="w-5 h-5" />
          <p>Continue with Email</p>
        </div>
      </button>

      <button className="border rounded-md bg-white p-1">
        <div className="flex gap-5 items-center justify-center">
          <img src={Google} alt="google" className="w-7 h-7" />
          <p>Continue with Google</p>
        </div>
      </button>

      <button className="border rounded-md bg-white p-1">
        <div className="flex gap-5 justify-center">
          <img src={Facebook} alt="facebook" className="w-5 h-5" />
          <p>Continue with Facebook</p>
        </div>
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
        <input type="checkbox" />
        <p>
          By confirming the order, I accept the{" "}
          <span className="text-blue-600 underline cursor-pointer">
            terms of the user{" "}
          </span>
          agreement.
        </p>
      </div>
    </div>
  );
};

export default LoginMob;
