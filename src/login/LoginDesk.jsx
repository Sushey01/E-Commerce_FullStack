import { Smile } from 'lucide-react'
import React from 'react'

const LoginDesk = () => {
  return (
    <div className='flex flex-col p-6 justify-between bg-gray-100 rounded-md md:rounded-br-none md:rounded-tr-none shadow-lg w-full h-full animate-fade-in'>
      <p className='text-2xl font-semibold mb-2 animate-slide-in-down'>
        Welcome!
      </p>

      <div className='flex items-center justify-center gap-3 mb-4 animate-slide-in-left'>
        <p className='text-6xl text-gray-400 font-bold'>S.</p>
        <Smile className='w-24 h-24 text-blue-500 hover:rotate-12 transition-transform duration-300' />
      </div>

      <p className='flex gap-1 text-sm text-gray-600 animate-slide-in-up'>
        Already a member?
        <span className='underline text-blue-500 hover:text-blue-700 cursor-pointer transition-colors'>
          Login now
        </span>
      </p>
    </div>
  );
};

export default LoginDesk;
