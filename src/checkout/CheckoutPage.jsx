import React from "react";
import {
  ArrowLeft,
  Calendar,
  CircleCheckBig,
  Clock,
  Flag,
  Store,
} from "lucide-react";
import { CiDeliveryTruck } from "react-icons/ci";
import OrderProduct from "./OrderProduct";
import Apple from "../assets/images/apple.svg";
import MasterCard from "../assets/images/mastercard.png";
import Visa from "../assets/images/visa.png";

const CheckoutPage = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen gap-8">
      {/* Left Section */}
      <div className="w-full lg:w-2/3">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft className="cursor-pointer" />
          <p className="text-2xl font-semibold">Checkout</p>
        </div>

        {/* Contact Information */}
        <p className="text-lg font-semibold mb-2">1. Contact Information</p>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              placeholder="Eduard"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Franz"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm font-medium mb-1">Phone</label>
            <div className="flex items-center gap-4 border px-3 py-2 justify-evenly rounded-md w-full ">
              <Flag className="w-4 h-4 text-gray-500" />
              <select className="outline-none bg-transparent border-r-2 pr-2 text-sm">
                <option>+977</option>
                <option>+380</option>
                <option>+900</option>
              </select>
              <div className="flex justify-between items-center w-1/2">
                <p className="text-sm text-gray-700">555-0115</p>
                <CircleCheckBig className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              placeholder="dinary@gmail.com"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
        </div>

        {/* Delivery Method */}
        <p className="text-lg font-semibold mb-2">2. Delivery Method</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
            <Store />
            Store
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-500 bg-blue-100 rounded-md text-blue-700">
            <CiDeliveryTruck />
            Delivery
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium mb-1 block">
              Delivery Date
            </label>
            <div className="flex justify-between items-center border px-3 py-2 rounded-md">
              <span>November 26th, 2025</span>
              <Calendar />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium mb-1 block">
              Convenient Time
            </label>
            <div className="flex justify-between items-center border px-3 py-2 rounded-md">
              <span>1 pm - 6 pm</span>
              <Clock />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <label className="text-sm font-medium mb-1 block">City</label>
            <select className="border px-3 py-2 rounded-md w-full">
              <option>Lalitpur</option>
              <option>Kathmandu</option>
              <option>Bhaktapur</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="text-sm font-medium mb-1 block">Address</label>
            <input
              placeholder="Bhaisepati-25"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="text-sm font-medium mb-1 block">ZIP Code</label>
            <input
              placeholder="44700"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
        </div>

        {/* Payment Method */}
        <p className="text-lg font-semibold mb-2">3. Payment Method</p>
        <div className="flex flex-wrap gap-4">
          <button className="border px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <img src={MasterCard} alt="MasterCard" className="w-8 h-6" />
          </button>
          <button className="border px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <img src={Visa} alt="Visa" className="w-8 h-7" />
          </button>
          <button className="border px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <img src={Apple} alt="Apple Pay" className="w-6 h-6" />
            Pay
          </button>
          <button className="border px-4 py-2 rounded-full text-sm font-medium">
            Other
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/3">
        <OrderProduct />
      </div>
    </div>
  );
};

export default CheckoutPage;
