import Visa from "../assets/images/visa.png";
import MasterCard from "../assets/images/mastercard.png";
import React, { useEffect, useState } from "react";
import OrderItem from "../components/OrderItem";
import OrderSummary from "../components/OrderSummary";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

const OrderContactForm = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  
  const [deliveryMethod, setDeliveryMethod]= useState("standard")
  const shipping = deliveryMethod === "express" ? 5:0;

  const savedContact = JSON.parse(localStorage.getItem("orderinfo") || "[]");

  const handleInformation = (data) => {
    const savedContact = localStorage.getItem("orderinfo");
    const form = data ? JSON.parse(data) : [];
  };

  const [submittedData, setSubmittedData] = useState();

  const { register, handleSubmit, watch, reset } = useForm();

  function onSubmit(data) {
    setSubmittedData(data);
    localStorage.setItem("orderinfo", JSON.stringify(data));
    console.log("form data:", data);
  }

  const handleCancel = (e) => {
    e.preventDefault();
    reset();
  };

  return (
    <>
      {!submittedData ? (
        <div className="border rounded-md bg-gray-50 flex w-full gap-2 p-6">
          <form
            className="w-full gap-2 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1">
              <p>Contact Information</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("firstname", { required: true })}
                    type="text"
                    placeholder="First name"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("lastname", { required: true })}
                    type="text"
                    placeholder="Last name"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Email address"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("phonenumber", { required: true })}
                    type="text"
                    placeholder="Phone number"
                  />
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
                  <input
                    {...register("country", { required: true })}
                    type="text"
                    placeholder="Country"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("city", { required: true })}
                    type="text"
                    placeholder="City"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    placeholder="Address"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("postalno", { required: true })}
                    type="text"
                    placeholder="Postal code.."
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <select {...register("province")}>
                    <option>Koshi</option>
                    <option>Madhesh</option>
                    <option>Bagmati</option>
                    <option>Karnali</option>
                    <option>Gandaki</option>
                    <option>Lumbini</option>
                    <option>Sudurpaachim</option>
                  </select>
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    type="text"
                    placeholder="Street or Famous place near you."
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-200 py-2 px-4 text-gray-800 border rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInformation(data)}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white border rounded-sm"
              >
                Save
              </button>
            </div>
          </form>
          {/* <div className="flex flex-col w-[30%]">
        <OrderItem />
        <OrderSummary />
      </div> */}
        </div>
      ) : (
        //Show Billing or Shipping Address.

        <div className="p-2 flex flex-col w-1/2 bg-gray-100 border rounded-none">
          <div className="flex justify-between">
            <p className="text-sm">Shipping Address</p>
            <button
              onClick={() => submittedData(data)}
              className="text-blue-500"
            >
              EDIT
            </button>
          </div>
          <div className="flex gap-4">
            <p>
              Name:{submittedData.firstname} {submittedData.lastname}
            </p>
            <p>Number:{submittedData.phonenumber}</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-orange-500 border rounded-full px-4 text-white text-base">
              HOME
            </button>
            <p>
              Address:{submittedData.address}, {submittedData.city},{" "}
              {submittedData.country}, {submittedData.postalno}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderContactForm;
