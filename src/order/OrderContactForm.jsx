import Visa from "../assets/images/visa.png";
import MasterCard from "../assets/images/mastercard.png";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import supabase from "../supabase";

const OrderContactForm = ({ onSaved, initialAddress }) => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const shipping = deliveryMethod === "express" ? 5 : 0;

  const [submittedData, setSubmittedData] = useState(() => {
    if (initialAddress) return initialAddress;
    const saved = JSON.parse(localStorage.getItem("orderinfo")) || [];
    return saved.length ? saved[saved.length - 1] : null;
  });

  const { register, handleSubmit, watch, reset } = useForm();

  async function onSubmit(data) {
    // Normalize to the AddressBook schema
    const normalized = {
      full_name: `${data.firstname ?? ""} ${data.lastname ?? ""}`.trim(),
      phone: data.phonenumber ?? "",
      line1: data.address ?? "",
      line2: data.landmark ?? "",
      city: data.city ?? "",
      state: data.province ?? "",
      postal_code: data.postalno ?? "",
      country: data.country ?? "",
      // keep email only for local UI needs
      email: data.email ?? "",
      is_default: false,
    };

    //Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      // Persist to localStorage only when not authenticated (fallback)
      let saved = JSON.parse(localStorage.getItem("orderinfo"));
      if (!Array.isArray(saved)) saved = [];
      localStorage.setItem("orderinfo", JSON.stringify([...saved, normalized]));
      setSubmittedData(normalized);
      if (typeof onSaved === "function") onSaved(normalized);
      return;
    }

    // Determine if this should be default (if user has no addresses yet)
    let isDefault = normalized.is_default;
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("addresses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!fetchErr && existing === null) {
        // When using head:true, data is null; use count from response
      }
      // Supabase-js v2 returns count on the response object, but since we didn't destructure it,
      // we infer default by trying a second query without head if needed.
      if (fetchErr) {
        // noop; fall back
      }
      // Fallback simple fetch to check emptiness
      const { data: list } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (!list || list.length === 0) isDefault = true;
    } catch (_e) {
      // ignore, keep default false
    }

    // Prepare record for supabase using JSONB 'address' per your schema
    const record = {
      user_id: user.id,
      type: "shipping",
      label: null,
      address: {
        full_name: normalized.full_name,
        phone: normalized.phone,
        line1: normalized.line1,
        line2: normalized.line2,
        city: normalized.city,
        state: normalized.state,
        postal_code: normalized.postal_code,
        country: normalized.country,
      },
      is_default: isDefault,
    };

    const { data: inserted, error } = await supabase
      .from("addresses")
      .insert([record])
      .select()
      .single();
    if (error) {
      console.error("Error saving to supabase:", error);
    } else {
      // Use the inserted row so our checkout card matches Address Book exactly
      setSubmittedData(inserted);
      if (typeof onSaved === "function") onSaved(inserted);
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    reset();
  };

  const handleEdit = () => {
    // Map normalized submittedData back into form fields
    const fullName = submittedData?.full_name ?? "";
    const [fn = "", ln = ""] = fullName.split(" ");
    reset({
      firstname: submittedData?.firstname ?? fn,
      lastname: submittedData?.lastname ?? ln,
      email: submittedData?.email ?? "",
      phonenumber: submittedData?.phone ?? submittedData?.phonenumber ?? "",
      country: submittedData?.country ?? "",
      city: submittedData?.city ?? "",
      address: submittedData?.line1 ?? submittedData?.address ?? "",
      postalno: submittedData?.postal_code ?? submittedData?.postalno ?? "",
      province: submittedData?.state ?? submittedData?.province ?? "",
    });
    setSubmittedData(null); //show form
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
        // Show saved Shipping Address in aligned card style similar to Address Book
        <div className="w-full md:w-2/3 lg:w-1/2">
          <div className="border rounded p-4 bg-white space-y-2 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-semibold">
                  {submittedData.full_name
                    ? submittedData.full_name
                    : `${submittedData.firstname ?? ""} ${
                        submittedData.lastname ?? ""
                      }`.trim()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                  Home
                </span>
                <button
                  onClick={handleEdit}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p>{submittedData.line1 ?? submittedData.address}</p>
              <p>
                {submittedData.city}
                {submittedData.state || submittedData.province
                  ? `, ${submittedData.state ?? submittedData.province}`
                  : ""}
                {submittedData.country ? `, ${submittedData.country}` : ""}
                {submittedData.postal_code || submittedData.postalno
                  ? ` ${submittedData.postal_code ?? submittedData.postalno}`
                  : ""}
              </p>
              <p className="text-gray-500">
                📞 {submittedData.phone ?? submittedData.phonenumber}
              </p>
            </div>
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
