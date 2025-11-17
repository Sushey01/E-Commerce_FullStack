// NewGadgetAlertPromotion.tsx
import React from "react";
// @ts-ignore
import Iphone from "../../../../../assets/images/iphone.webp";


interface NewGadgetAlertPromotionProps {
  onClose?: () => void;
}

const NewGadgetAlertPromotion: React.FC<NewGadgetAlertPromotionProps> = ({
  onClose,
}) => {
  return (
    <div className="relative w-full max-w-xs flex items-center bg-teal-200 rounded-lg shadow-xl p-4 text-gray-800">
      {/* Image Section (Headphones & Gamepad) */}
      <div className="flex-shrink-0 w-1/3 mr-3">
        <img
          src={Iphone}
          alt="New Gadget Fare"
          className="w-full h-auto object-cover rounded"
        />
      </div>

      {/* Text Content */}
      <div className="flex-grow">
        <p className="text-sm font-semibold leading-tight">
          New Gadget Fare in Active eCommerce CMS. Click here to view the
          products.
        </p>
      </div>

      {/* Small Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900 transition"
          aria-label="Dismiss Gadget Promotion"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default NewGadgetAlertPromotion;
