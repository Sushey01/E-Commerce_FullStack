import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import departments from "./DepartmentData";  // Import your data card here

const Sidebar = ({ onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">All Departments</h2>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {departments.map((dept, i) => (
          <div key={i}>
            <button
              onClick={() => toggleExpand(i)}
              className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">{dept.icon}</span>
                <span className="text-base">{dept.title}</span>
              </div>
              <RiArrowRightSLine
                className={`text-gray-500 transition-transform duration-300 ${
                  expandedIndex === i ? "rotate-90" : ""
                }`}
                size={20}
              />
            </button>

            {expandedIndex === i && dept.sublist && (
              <ul className="pl-12 bg-gray-50">
                {dept.sublist.map((sub, idx) => (
                  <li
                    key={idx}
                    className="py-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <a
                      href={sub.link}
                      className="text-gray-600 hover:text-gray-900 block"
                    >
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
