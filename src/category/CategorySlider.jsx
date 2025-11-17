import { useNavigate } from "react-router-dom";
import React from "react";

const CategorySectionCard = ({ title, items, image }) => {
  // const navigate = useNavigate();

  return (
    <div
      // onClick={() => navigate(`/category/${title.toLowerCase()}`)} 
      // Removed surrounding padding/margins from the main div. Spacing will now be controlled by the parent grid/flex container.
      // NOTE: If this component is in a grid, use `gap-x` and `gap-y` on the parent.
      className="group flex flex-col items-center justify-start
                 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48  /* Scalable Fixed Size */
                 bg-white rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-300 ease-in-out cursor-pointer
                 transform hover:scale-105"
    >
      {/* Image Section - Reduced the top margin to bring content closer */}
      <div 
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 /* Inner circle size scales */
                   overflow-hidden rounded-full flex items-center justify-center
                   border-4 border-white group-hover:border-indigo-400 transition-colors duration-300 **mt-1**"> {/* Reduced margin-top from mt-2 to mt-1 */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Text Section - Reduced top margin and added line-clamp-1 */}
      <div className="**mt-1** text-center w-full px-1"> {/* Reduced margin-top from mt-2 to mt-1 */}
        <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 **line-clamp-1**">
          {title}
        </p>
        {/* Optional second line, using even smaller responsive text */}
        {/* <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">{items}</p> */}
      </div>
    </div>
  );
};

export default CategorySectionCard;