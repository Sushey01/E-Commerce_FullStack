import React from 'react';
import {
  HomeIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const BottomNavBarMobile = () => {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {/* Home (Active) */}
        <div className="flex flex-col items-center text-black">
          <HomeIcon className="h-6 w-6" />
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
        </div>

        {/* Wishlist */}
        <div className="flex flex-col items-center text-gray-400">
          <HeartIcon className="h-6 w-6" />
        </div>

        {/* Cart */}
        <div className="flex flex-col items-center text-gray-400">
          <ShoppingCartIcon className="h-6 w-6" />
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-gray-400">
          <UserIcon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default BottomNavBarMobile;
