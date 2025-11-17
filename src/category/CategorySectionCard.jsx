import { useNavigate } from "react-router-dom";
import React from "react";

const CategorySectionCard = ({ title, items, image }) => {
  // You would typically add a click handler here
  // const navigate = useNavigate();
  // const handleCardClick = () => {
  //   navigate(`/category/${title.toLowerCase()}`);
  // };

  return (
    <div
      // onClick={handleCardClick} // Uncomment if using useNavigate
      // Reduced shadow, slightly smaller scale for a more contained feel
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden transform hover:scale-[1.01]"
    >
      {/* Image Section - Reduced Height */}
      <div className="w-full **h-28** md:h-36 overflow-hidden">
        <img
          src={image}
          alt={title}
          // The image remains object-cover for full impact
          className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Text Section - Reduced Padding */}
      <div className="**p-3** md:p-4 flex flex-col gap-1">
        {/* Title: Smaller font size for the compact card */}
        <p className="**text-lg** md:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
          {title}
        </p>

        {/* Item count/description: Smaller text, limited lines */}
        <p className="text-sm text-gray-500 line-clamp-1">{items}</p>
      </div>
    </div>
  );
};

export default CategorySectionCard;
