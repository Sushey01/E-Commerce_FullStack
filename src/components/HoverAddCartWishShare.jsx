import { Heart, Share2, ShoppingCart } from 'lucide-react'
import React from 'react'

const HoverAddCartWishShare = ({onAddToCart, onAddtoWishList, onShare}) => {
  return (
    <div className='md:p-1.5 p-1 flex flex-col gap-2 border cursor-pointer bg-[#f69620]'>
      <div className='border p-1 rounded-full  flex justify-center bg-white ' onClick={onAddToCart}>
        <ShoppingCart className='w-4 h-4'/>
      </div>
      <div className='border p-1 rounded-full flex justify-center hover:text-red-400 bg-white' onClick={onAddtoWishList}>
        <Heart className='w-4 h-4'/>
      </div>
      <div className='border p-1 rounded-full flex justify-center bg-white' onClick={onShare}>
        <Share2 className='w-4 h-4'/>
      </div>
    </div>
  )
}

export default HoverAddCartWishShare
