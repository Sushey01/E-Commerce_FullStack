import { Heart, Share2, ShoppingCart } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../features/wishlistSlice';
import { addToCartlist } from '../features/cartlistSlice';


const HoverAddCartWishShare = ({ product = {} }) => {
  const dispatch = useDispatch();
  const onAddToWishList = () => {
    dispatch(addToWishlist(product));
  }

 const onAddToCart = () => {
  // Always attach a unique id if not present
  const productWithId = {
    ...product,
    id: product.id ?? Date.now() + Math.random() // fallback unique id
  };
  dispatch(addToCartlist(productWithId));
};

  return (
    <div className='md:p-1.5 p-1 flex flex-col gap-2 border cursor-pointer bg-[#f69620]'>
      
      <div className='border p-1 rounded-full flex justify-center bg-white' >
        <ShoppingCart className='w-4 h-4' onClick={onAddToCart} />
      </div>
      
      <div className='border p-1 rounded-full flex justify-center hover:text-red-400 bg-white' onClick={onAddToWishList}>
        <Heart className='w-4 h-4' />
      </div>
      
      <div className='border p-1 rounded-full flex justify-center bg-white' >
        <Share2 className='w-4 h-4'/>
      </div>
      
    </div>
  );
}

export default HoverAddCartWishShare;
