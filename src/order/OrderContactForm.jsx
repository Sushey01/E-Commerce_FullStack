import Visa from "../assets/images/visa.png";
import MasterCard from "../assets/images/mastercard.png";
import React from "react";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";

const OrderContactForm = () => {
  return (
    <div className="border rounded-md bg-gray-50 flex w-full gap-2 p-6">
      <form className="w-full gap-2 flex flex-col">
        <div className="flex flex-col gap-1">
          <p>Contact Information</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="First name" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="Last name" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="email" placeholder="Email address" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="Phone number" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p>Delivery Method</p>
          <label className="border text-xs md:text-sm items-center rounded px-4 flex gap-2 py-2 text-gray-600">
            <input
              type="radio"
              name="delivery"
              value="standard"
              // onChange={() => handleChange("standard")}
            />
            Standard delivery (5–6 days) FREE
          </label>

          <label className="border text-xs md:text-sm items-center rounded px-4 flex gap-2 py-2 text-gray-600">
            <input
              type="radio"
              name="delivery"
              value="express"
              // onChange={() => handleChange("express")}
            />
            Express Delivery (1–2 days) $5
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <p>Shipping Information</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="Country" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="City" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="email" placeholder="Address" />
            </label>
            <label className="border rounded px-4 py-2">
              <input type="text" placeholder="Postal code.." />
            </label>
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <p>Payment Method</p>
          <label className="border items-center rounded px-4 flex gap-2 py-2 ">
            <input
              type="radio"
              name="visa"
              value="standard"
              // onChange={() => handleChange("standard")}
            />
            <div className="flex w-full justify-between items-center">
              <p className="text-gray-500 md:text-sm text-xs">Visa</p>
              <img src={Visa} className="h-6 w-6" />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3 ">
            <label className="border  rounded px-4 flex gap-2 py-2 ">
              <input type="text" name="card" placeholder="Card number" />
            </label>

            <label className="border rounded px-4 flex gap-2 py-2 ">
              <input
                type="text"
                name="card"
                placeholder="Cardholder full name"
              />
            </label>

            <label className="border rounded px-4 flex gap-2 py-2 ">
              <input
                type="text"
                name="card"
                placeholder="Expiry date (MM/YY)"
              />
            </label>

            <label className="border rounded px-4 flex gap-2 py-2 ">
              <input type="text" name="card" placeholder="cvv" />
            </label>
          </div>
          <div className="w-full flex  flex-col gap-2">
            <label className="border items-center rounded px-4 flex gap-2 py-2 w-full ">
              <input
                type="radio"
                name="khalti"
                value="standard"
                // onChange={() => handleChange("standard")}
              />
              <div className="flex justify-between w-full items-center">
                <p className="text-gray-500 text-xs md:text-sm">Khalti</p>
                <img src={MasterCard} className="h-6 w-6" />
              </div>
            </label>

            <label className="border items-center rounded px-4 flex gap-2 py-2 w-full ">
              <input
                type="radio"
                name="esewa"
                value="standard"
                // onChange={() => handleChange("standard")}
              />
              <div className="flex justify-between w-full items-center">
                <p className="text-gray-500 text-xs md:text-sm">E-sewa</p>
                <img src={MasterCard} className="h-6 w-6" />
              </div>
            </label>

            <label className="border items-center rounded px-4 flex gap-2 py-2 w-full ">
              <input
                type="radio"
                name="mastercard"
                value="standard"
                // onChange={() => handleChange("standard")}
              />
              <div className="flex justify-between w-full items-center">
                <p className="text-gray-500 text-xs md:text-sm">MasterCard</p>
                <img src={MasterCard} className="h-6 w-6" />
              </div>
            </label>
          </div>
        </div> */}
      </form>
      {/* <div className="flex flex-col w-[30%]">
        <OrderItem />
        <OrderSummary />
      </div> */}
    </div>
  );
};

export default OrderContactForm;
