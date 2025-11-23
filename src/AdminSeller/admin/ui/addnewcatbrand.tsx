import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DropdownItemProps {
  text: string;
  onClick: () => void;
}

const DropdownItem = ({ text, onClick }: DropdownItemProps) => (
  <button
    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 whitespace-nowrap"
    onClick={onClick}
  >
    <span className="mr-2 text-base font-semibold text-gray-400">+</span>
    {text}
  </button>
);

const AddNewCatBrand = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (type: "product" | "category" | "brand") => {
    setOpen(false);
    switch (type) {
      case "product":
        navigate("/add-product");
        break;
      case "category":
        navigate("/add-category");
        break;
      case "brand":
        navigate("/add-brand");
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="
          flex items-center bg-blue-50 text-blue-600 
          hover:bg-blue-100 transition-colors duration-200
          rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <Plus className="h-4 w-4 mr-1" />
        Add New
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="
            absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl
            ring-1 ring-black ring-opacity-5 z-50
          "
        >
          <div className="py-1">
            <DropdownItem
              text="New Product"
              onClick={() => handleItemClick("product")}
            />
            <DropdownItem
              text="New Category"
              onClick={() => handleItemClick("category")}
            />
            <DropdownItem
              text="New Brand"
              onClick={() => handleItemClick("brand")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewCatBrand;
