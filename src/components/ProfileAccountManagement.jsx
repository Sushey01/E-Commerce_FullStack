import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import Spinner from "./Spinner";

const ProfileAccountManagement = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data, error: userError } = await supabase.auth.getUser();
        const user = data?.user;
        if (userError || !user) {
          console.error("No user logged in");
          setLoading(false);
          return;
        }

        const { data: addresses, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching address:", error);
          setLoading(false);
          return;
        }

        if (addresses.length > 0) {
          const row = addresses[0];
          const parsedAddress =
            typeof row.address === "string"
              ? JSON.parse(row.address)
              : row.address;
          setUserData({ ...row, address: parsedAddress });
        } else {
          setUserData({ address: {} });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleAddressChange = (field, value) => {
    setUserData({
      ...userData,
      address: {
        ...userData.address,
        [field]: value,
      },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 flex gap-3 flex-col w-full border rounded-lg shadow-[0px_-5px_5px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b-2 gap-2">
        <p className="text-xl">Manage My Account</p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20">
          <div className="flex flex-col gap-1 w-full">
            <p>Full Name</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.firstname || ""}
              onChange={(e) => handleAddressChange("firstname", e.target.value)}
              placeholder="Enter Your Full Name"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p>Mobile Number</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.phonenumber || ""}
              onChange={(e) =>
                handleAddressChange("phonenumber", e.target.value)
              }
              placeholder="Enter Mobile Number"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20">
          <div className="flex flex-col gap-1 w-full">
            <p>Shipping Address</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Enter Shipping Address"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p>Default Billing Address</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.billing || ""}
              onChange={(e) => handleAddressChange("billing", e.target.value)}
              placeholder="Enter Billing Address"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20">
          <div className="flex flex-col gap-1 w-full">
            <p>City / Province</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="Enter City"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p>Postal / Country</p>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.address?.postalno || ""}
              onChange={(e) => handleAddressChange("postalno", e.target.value)}
              placeholder="Enter Postal / Country"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAccountManagement;
