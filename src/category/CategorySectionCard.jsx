import React from "react";

const CategorySectionCard = ({ title, items, image }) => {
  return (
    <div className="group bg-[#efecec] border rounded-md transition duration-300 ease-in-out hover:shadow-lg cursor-pointer overflow-hidden">

      {/* Text Section */}
      <div className="p-4 gap-2 flex flex-col">
        <div className="border-b-2 w-1/2 border-gray-400">
          <p className="text-xl md:text-2xl pb-1">{title}</p>
        </div>
        <p className="text-sm md:text-lg text-gray-700">{items}</p>
      </div>

      {/* Image Section */}
      <div className="w-full flex justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full p-2 h-40 object-contain rounded transition-transform duration-300 md:group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default CategorySectionCard;
