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
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {/* Home (Active) */}
        <div className="flex flex-col items-center text-black">
          <HomeIcon className="h-8 w-8"/>
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" onClick={()=>navigate("/")} />
        </div>

        {/* Wishlist */}
        <div className="flex flex-col items-center text-gray-400">
          <HeartIcon className="h-8 w-8" onClick={()=>navigate("/wishlist")} />
        </div>

        {/* Cart */}
        <div className="flex flex-col items-center text-gray-400">
          <ShoppingCartIcon className="h-8 w-8" onClick={()=>navigate("/cart")}/>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-gray-400">
          <UserIcon className="h-8 w-8 " 
          onClick={()=>navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNavBarMobile;
