import React from 'react';
import {
  HomeIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const BottomNavBarMobile = () => {
  const navigate=useNavigate()


  return (
    <div className="fixed bottom-3 w-full bg-[#222121] border-t border rounded-full border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {/* Home (Active) */}
        <div className="flex flex-col items-center text-white">
          <HomeIcon className="h-6 w-6"/>
          <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" onClick={()=>navigate("/")} />
        </div>

        {/* Wishlist */}
        <div className="flex flex-col items-center text-gray-400">
          <HeartIcon className="h-6 w-6" onClick={()=>navigate("/wishlist")} />
        </div>

        {/* Cart */}
        <div className="flex flex-col items-center text-gray-400">
          <ShoppingCartIcon className="h-6 w-6" onClick={()=>navigate("/cart")}/>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-gray-400">
          <UserIcon className="h-6 w-6 " 
          onClick={()=>navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNavBarMobile;
