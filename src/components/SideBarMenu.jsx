import React, { useState } from "react";
import {
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaClock,
  FaVrCardboard,
  FaCamera,
  FaHeadset,
  FaPlug,
  FaTv,
  FaMouse,
  FaTimes,
} from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";

const departments = [
  { icon: <FaMobileAlt />, title: "Smartphone & Tablets" },
  { icon: <FaLaptop />, title: "Laptop & Desktop" },
  { icon: <FaHeadphones />, title: "Headphones" },
  { icon: <FaClock />, title: "Smart Watches" },
  { icon: <FaVrCardboard />, title: "Virtual Reality Headsets" },
  { icon: <FaCamera />, title: "Drone & Camera" },
  { icon: <FaHeadset />, title: "Wireless Headphone" },
  { icon: <FaPlug />, title: "Electronics Accessories" },
  { icon: <FaTv />, title: "Electronic, TVs & More" },
  { icon: <FaMouse />, title: "Computer Peripherals" },
];

const Sidebar = ({ onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">All Department</h2>
        <button onClick={onClose} aria-label="Close sidebar" className="text-gray-600 hover:text-gray-900">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Departments list */}
      <div className="flex-1 overflow-y-auto">
        {departments.map((dept, i) => (
          <button
            key={i}
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
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
