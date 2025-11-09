import React from 'react'

const FlashDeals = () => {
  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center py-2">
        <h1>All Flash Deals</h1>
        <button className='hover:bg-purple-600 bg-purple-500 border rounded-3xl p-3 text-white'>Create New Flash Deal</button>
      </div>


      <div className='border rounded-xl p-4 rounded-bl-none rounded-br-none flex justify-between items-center'>
        <h2>Flash Deals</h2>
        <input 
        type='text'
        placeholder='Type deals & Enter'
        className='border p-2 text-center rounded-sm text-black focus:outline-none ring-0'
        />
      </div>
    </div>
  );
}

export default FlashDeals
