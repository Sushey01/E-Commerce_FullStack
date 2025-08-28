import Visa from "../assets/images/visa.png"
import MasterCard from "../assets/images/mastercard.png"
import React from 'react'

const OrderContactForm = () => {
  return (
    <form>
      <div className="flex flex-col gap-1">
        <p>Contact Information</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="border rounded px-6 py-2">
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
        <label className="border rounded px-4 flex gap-2 py-2 ">
          <input
            type="radio"
            name="delivery"
            value="standard"
            // onChange={() => handleChange("standard")}
          />
          Standard delivery (5–6 days) FREE
        </label>

        <label className="border rounded px-4 flex gap-2 py-2 ">
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
          <label className="border rounded px-6 py-2">
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

      <div className="flex flex-col gap-2">
        <p>Payment Method</p>
        <label className="border rounded px-4 flex gap-2 py-2 ">
          <input
            type="radio"
            name="visa"
            value="standard"
            // onChange={() => handleChange("standard")}
          />
          <div className="flex w-full justify-between">
            <p>Visa</p>
            <img src={Visa} className="h-6 w-6" />
          </div>
        </label>

        <div className="grid grid-cols-2 gap-3 ">
          <label className="border rounded px-4 flex gap-2 py-2 ">
            <input type="text" name="card" placeholder="Card number" />
          </label>

          <label className="border rounded px-4 flex gap-2 py-2 ">
            <input type="text" name="card" placeholder="Cardholder full name" />
          </label>

          <label className="border rounded px-4 flex gap-2 py-2 ">
            <input type="text" name="card" placeholder="Expiry date (MM/YY)" />
          </label>

          <label className="border rounded px-4 flex gap-2 py-2 ">
            <input type="text" name="card" placeholder="cvv" />
          </label>


    </div>
<div className="w-full flex flex-col gap-2">

          <label className="border rounded px-4 flex gap-2 py-2 w-full ">
            <input
              type="radio"
              name="khalti"
              value="standard"
              // onChange={() => handleChange("standard")}
            />
            <div className="flex justify-between w-full">
              <p>Khalti</p>
              <img src={MasterCard} className="h-6 w-6" />
            </div>
          </label>

          <label className="border rounded px-4 flex gap-2 py-2 w-full ">
            <input
              type="radio"
              name="esewa"
              value="standard"
              // onChange={() => handleChange("standard")}
              />
            <div className="flex justify-between w-full">
              <p>E-sewa</p>
              <img src={MasterCard} className="h-6 w-6" />
            </div>
          </label>

          <label className="border rounded px-4 flex gap-2 py-2 w-full ">
            <input
              type="radio"
              name="mastercard"
              value="standard"
              // onChange={() => handleChange("standard")}
            />
            <div className="flex justify-between w-full">
              <p>MasterCard</p>
              <img src={MasterCard} className="h-6 w-6" />
            </div>
          </label>
              </div>
      </div>
    </form>
  );
}

export default OrderContactForm
