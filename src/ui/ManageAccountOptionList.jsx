import React from 'react';

const ManageAccountOptionList = () => {
  const options = [
    'My Profile',
    'Address Book',
    'Payment Options',
    'My Review',
    'My Return',
    'My Cancellation',
    'My Wishlist',
  ];

  return (
    <div className="w-full p-4 shadow-sm  ">
      <p className="font-semibold text-[22px] mb-3 ">Manage My Account</p>

      <ul className="text-[16px] flex flex-col gap-2 ">
        {options.map((option, index) => (
          <li
            key={index}
            className="cursor-pointer py-1 hover:text-[#0296a0] transition-colors"
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAccountOptionList;
