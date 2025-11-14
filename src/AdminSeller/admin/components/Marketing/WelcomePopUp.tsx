import React, { useEffect, useState } from "react";

interface WelcomePopUpProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const WelcomePopUp: React.FC<WelcomePopUpProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always use parent's isOpen prop
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const closeModal = () => {
    setIsOpen(false);
    // Parent (ShowStepWisePopUp) handles localStorage
    if (externalOnClose) {
      externalOnClose();
    }
  };

  if (!isOpen) return null;

  return (
    // --- Overlay ---
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 p-4 pt-5">
      {/* --- Modal Container --- */}
      <div className="relative right-0  w-full max-w-xl overflow-hidden bg-white rounded-none shadow-2xl transition-all duration-300">
        {/* --- HEADER SECTION (Copied from your welcome popup) --- */}
        <div className="relative h-56 bg-[#16213D] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[16rem] sm:text-[20rem] font-extrabold text-[#111A31] opacity-60 leading-none select-none">
              01
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-4 right-6 sm:right-4 bg-[#FF4500] p-2 text-center rounded-lg shadow-md">
            <span className="block text-white text-xs font-semibold uppercase leading-none">
              THE CORE Sowis eCommerce
            </span>
          </div>

          {/* --- Close Button (Same style as Newsletter) --- */}
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 z-10 p-2 text-white bg-red-500 hover:bg-red-600 rounded-full transition duration-150 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* --- CONTENT SECTION (Cleaned + same structure as newsletter) --- */}
        <div className="p-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Introducing Dynamic E-commerce
          </h2>

          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-base">
            Welcome to <strong>Sowis eCommerce !</strong> Experience
            <strong> The Core</strong> — our brand-new homepage with a modern
            header, powerful features, and major enhancements.
          </p>

          <button
            onClick={closeModal}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-10 rounded shadow-lg transition"
          >
            View Update Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopUp;
