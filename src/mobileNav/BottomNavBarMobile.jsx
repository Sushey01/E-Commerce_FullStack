// import React from 'react';
// import {
//   HomeIcon,
//   HeartIcon,
//   ShoppingCartIcon,
//   UserIcon,
// } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';

// const BottomNavBarMobile = () => {
//   const navigate=useNavigate()


//   return (
//     <div className="fixed bottom-0  w-full  bg-white p-2 border  z-50 ">
//       <div className="flex justify-around items-center py-2">
//         {/* Home (Active) */}
//         <div className="flex flex-col items-center text-text">
//           <HomeIcon className="h-6 w-6"/>
//           <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" onClick={()=>navigate("/")} />
//         </div>

//         {/* Wishlist */}
//         <div className="flex flex-col items-center text-gray-400">
//           <HeartIcon className="h-6 w-6" onClick={()=>navigate("/wishlist")} />
//         </div>

//         {/* Cart */}
//         <div className="flex flex-col items-center text-gray-400">
//           <ShoppingCartIcon className="h-6 w-6" onClick={()=>navigate("/cart")}/>
//         </div>

//         {/* Profile */}
//         <div className="flex flex-col items-center text-gray-400">
//           <UserIcon className="h-6 w-6 " 
//           onClick={()=>navigate("/profile")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BottomNavBarMobile;



import React from 'react';
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  MessageCircle,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavBarMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t z-50 p-3">
      <div className="flex justify-around items-center">
        {/* Home */}
        <div
          className={`flex flex-col items-center ${
            location.pathname === '/' ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => navigate('/')}
        >
          <Home className="h-6 w-6" />
          {location.pathname === '/' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
          )}
        </div>

        {/* Wishlist */}
        <div
          className={`flex flex-col items-center ${
            location.pathname === '/wishlist' ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => navigate('/wishlist')}
        >
          <Heart className="h-6 w-6" />
          {location.pathname === '/wishlist' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
          )}
        </div>

        {/* Cart */}
        <div
          className={`flex flex-col items-center ${
            location.pathname === '/cart' ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => navigate('/cart')}
        >
          <ShoppingCart className="h-6 w-6" />
          {location.pathname === '/cart' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
          )}
        </div>

        {/* Messages */}
        <div
          className={`flex flex-col items-center ${
            location.pathname === '/messages' ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => navigate('/messages')}
        >
          <MessageCircle className="h-6 w-6" />
          {location.pathname === '/messages' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
          )}
        </div>

        {/* Profile */}
        <div
          className={`flex flex-col items-center ${
            location.pathname === '/profile' ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => navigate('/profile')}
        >
          <User className="h-6 w-6" />
          {location.pathname === '/profile' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNavBarMobile;


