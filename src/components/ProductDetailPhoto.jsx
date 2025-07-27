import React from 'react'
import ProductImage from "../assets/images/laptop.webp"
import ProductImage1 from "../assets/images/laptop1.webp"
import ProductImage2 from "../assets/images/laptop2.webp"
import ProductImage3 from "../assets/images/laptop3.webp"

const ProductDetailPhoto = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image with Stock Badge */}
      <div className="relative w-full">
        <img src={ProductImage} alt="laptop" className="w-full rounded object-cover" />
        <span className="absolute top-3 right-4 px-3 py-1 text-red-600 bg-pink-200 rounded-full text-sm font-medium shadow">
          Out of Stock
        </span>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <img src={ProductImage1} alt="laptop" className="w-full rounded cursor-pointer object-cover" />
        <img src={ProductImage2} alt="laptop" className="w-full rounded cursor-pointer object-cover" />
        <img src={ProductImage3} alt="laptop" className="w-full rounded cursor-pointer object-cover" />
      </div>
    </div>
  )
}

export default ProductDetailPhoto
