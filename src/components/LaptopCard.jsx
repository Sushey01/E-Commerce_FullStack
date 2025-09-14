import React from 'react'


const LaptopCard = ({reviews, title, price, image}) => {
  return (
    <>
      <div className='w-full flex flex-col items-center p-3 py-2 border-1 rounded-md bg-[#E6F4F1] '>
              <img src={image} alt={title} className='md:max-w-[150px]'/>
                    {/* ⭐ Rating */}
            <div className="flex items-center justify-between text-yellow-400 text-sm mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="10"
                  width="10"
                  style={{ color: "#ffc107" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                </svg>
              ))}
              <span className="ml-1 text-[10px] text-start md:text-sm text-gray-600 line-clamp-1">{reviews} Reviews</span>
            </div>
            <p className='mb-2 text-xs md:text-lg text-[#777] line-clamp-1'>{title}</p>
            <p className='text-xs md:text-lg text-center text-[#16A34A]'>Rs {price}</p>
            </div>
    </>
  )
}

export default LaptopCard
