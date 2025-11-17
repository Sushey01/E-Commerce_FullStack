import { useNavigate } from "react-router-dom";
import React from "react";

const CategorySectionCard = ({ title, items, image }) => {
  return (
    <div className="group flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 mb-5">
      {/* Circular Image Container */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-3">
        {/* Circular Border with Gradient on Hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[3px]">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>

        {/* Circular Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 border-4 border-gray-100 group-hover:border-white">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center px-2">
        <p className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1 mb-1">
          {title}
        </p>
        <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{items}</p>
      </div>
    </div>
  );
};

export default CategorySectionCard;
