import React from "react";

const ProfileAccountManagement = () => {
  return (
    <>
      <div className="p-4 flex gap-3 flex-col w-full border rounded-lg shadow-[0px_-5px_5px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b-2 gap-2">
          <p className="text-xl">Manage My Account</p>
          <button className="bg-[#0296a0] border rounded-sm flex gap-1 px-2 py-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              color="white"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
            <p className="text-white text-xs">Edit</p>
          </button>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20">
            <div className="flex flex-col gap-1 w-full">
              <p>Full Name</p>
              <input
                className="px-4 py-2 w-full border rounded-sm"
                placeholder="Enter Your Full Name"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <p>Mobile Number</p>
              <input
                className="px-4 py-2 w-full border rounded-sm"
                placeholder="Enter Your Mobile Number"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20">
            <div className="flex flex-col gap-1 w-full">
              <p>Shipping Address</p>
              <input
                className="px-4 py-2 w-full border rounded-sm"
                placeholder="Enter Shipping Address"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <p>Default Billing Address</p>
              <input
                className="px-4 py-2 w-full border rounded-sm"
                placeholder="Enter Billing Address"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAccountManagement;
