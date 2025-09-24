import React from "react";
import { useNavigate } from "react-router-dom";

const ManageAccountOptionList = () => {
  const navigate = useNavigate();

  const options = [
    { name: "My Profile", path: "/profile" },
    { name: "Address Book", path: "/address-book" },
    { name: "Payment Options", path: "/payment-options" },
    { name: "My Review", path: "/my-reviews" },
    { name: "My Return", path: "/my-returns" },
    { name: "My Cancellation", path: "/my-cancellations" },
    { name: "Become a Seller", path: "/become-seller" },
  ];

  const handleOptionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full p-4 shadow-sm  ">
      <p className="font-semibold text-sm md:text-[22px] mb-3 ">
        Manage My Account
      </p>

      <ul className="text-[16px] flex flex-col gap-2 ">
        {options.map((option, index) => (
          <li
            key={index}
            className="cursor-pointer py-1 hover:text-[#0296a0] transition-colors"
            onClick={() => handleOptionClick(option.path)}
          >
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAccountOptionList;
