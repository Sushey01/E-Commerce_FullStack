import React from 'react'
import ProductImage from "../assets/images/laptop.webp"
import ProductImage1 from "../assets/images/laptop1.webp"
import ProductImage2 from "../assets/images/laptop2.webp"
import ProductImage3 from "../assets/images/laptop3.webp"

const ProductDetailPhoto = () => {
  return (
    <>
     <div className='flex flex-col gap-2'>
        <div >
            <div className='relative w-full'>
            <img src={ProductImage} alt='laptop' className='border-none w-full  rounded'/>
            <h1 className='border rounded-full text-red-600 bg-pink-300 text-lg absolute top-3 right-4'>Out of Stock</h1>
            </div>

        </div>
        <div className='flex flex-wrap gap-3 border-none rounded w-full'>
            <img src={ProductImage1} alt='laptop'/>
            <img src={ProductImage2} alt='laptop'/>
            <img src={ProductImage3} alt='laptop'/>
        </div>
    </div> 
    </>
  )
}

export default ProductDetailPhoto
