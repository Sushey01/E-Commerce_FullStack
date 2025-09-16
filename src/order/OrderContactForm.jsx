import Visa from "../assets/images/visa.png";
import MasterCard from "../assets/images/mastercard.png";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

const OrderContactForm = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  
  const [deliveryMethod, setDeliveryMethod]= useState("standard")
  const shipping = deliveryMethod === "express" ? 5:0;


  

  const [submittedData, setSubmittedData] = useState(()=>{
    const saved = JSON.parse(localStorage.getItem("orderinfo"))||[];
    return saved.length?saved[saved.length-1]:null;
  });

  const { register, handleSubmit, watch, reset } = useForm();

  function onSubmit(data) {
    let saved = JSON.parse(localStorage.getItem("orderinfo"));

    // If saved is null or not an array, initialize as empty array
    if (!Array.isArray(saved)) saved = [];

    const updated = [...saved, data]; // append new address
    localStorage.setItem("orderinfo", JSON.stringify(updated));
    setSubmittedData(data); // show latest
    // console.log("form data:", data);
  }

  const handleCancel = (e) => {
    e.preventDefault();
    reset();
  };

  const handleEdit = ()=>{
    reset(submittedData); //populate form with current address
    setSubmittedData(null); //show form
  }

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
                <label className="border rounded px-2 sm:px-4 py-2">
                  <input
                    {...register("firstname", { required: true })}
                    type="text"
                    placeholder="First name"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-2 sm:px-4 py-2">
                  <input
                    {...register("lastname", { required: true })}
                    type="text"
                    placeholder="Last name"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-2 sm:px-4 py-2">
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Email address"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-2 sm:px-4 py-2">
                  <input
                    {...register("phonenumber", { required: true })}
                    type="text"
                    placeholder="Phone number"
                    className="w-full"
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

            <div className="flex flex-col gap-2">
              <p>Shipping Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("country", { required: true })}
                    type="text"
                    placeholder="Country"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("city", { required: true })}
                    type="text"
                    placeholder="City"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    placeholder="Address"
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <input
                    {...register("postalno", { required: true })}
                    type="text"
                    placeholder="Postal code.."
                    className="w-full"
                  />
                </label>
                <label className="border rounded px-4 py-2">
                  <select {...register("province")} className="w-full">
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
                    className="w-full"
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
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white border rounded-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        //Show Billing or Shipping Address.

        <div className="p-2 flex flex-col w-full md:w-1/2 bg-gray-100 border rounded-none">
          <div className="flex justify-between">
            <p className="text-sm">Shipping Address</p>
            <button onClick={handleEdit} className="text-blue-500">
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
      {/* {submittedData && 
     <div>
        <button onClick={()=>{onsubmit}}>ADD</button>
      </div>} */}
    </>
  );
};

export default OrderContactForm;
