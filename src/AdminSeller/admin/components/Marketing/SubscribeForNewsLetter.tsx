import React, { useEffect, useState } from "react";
// @ts-ignore
import NewsLetterImage from "../../../../assets/images/newsletter.webp"

const SubscribeForNewsLetter = () => {
  // State to manage the visibility of the modal
  const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  const lastShown = localStorage.getItem("newsletterLastShown");
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in ms

  if (!lastShown || now - parseInt(lastShown) > oneHour) {
    setTimeout(() => setIsOpen(true), 3000); // show after 3s
  }
}, []);


  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterLastShown", Date.now().toString())
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
    }

  // Tailwind CSS classes are used extensively for styling
  return (
    // Modal Overlay (Full screen, dark background, centered content)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 transform scale-100">
        {/* Close Button (Top right, similar to the orange 'x' in the image) */}
        <button
          onClick={closeModal}
          className="absolute top-0 right-0 z-10 p-2 text-white bg-red-500 hover:bg-red-600 rounded-full transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          aria-label="Close Pop-up"
        >
          {/* Simple 'X' icon */}
          <svg
            className="w-5 h-5"
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

        {/* 1. Top Image/Banner Section (Blue background with white dotted lines) */}
        <div className="relative h-60 bg-blue-500 overflow-hidden">
          {/* This section represents the stylized blue background with figures/doodles */}
          {/* In a real scenario, this would be an actual image or a complex background design */}
          <div className="absolute inset-0 bg-blue-500 p-0 flex items-center justify-center">
            {/* Placeholder for the image/design. You would replace this with an <img> tag */}
            {/* <p className="text-white text-lg font-semibold text-center"> */}
              <img src={NewsLetterImage} alt="newsletter"/>
            {/* </p> */}
          </div>
        </div>

        {/* 2. Content Section (Subscription Form) */}
        <div className="p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Subscribe to Our Newsletter
          </h2>

          <p className="text-gray-600 mb-6">
            Subscribe our newsletter for coupon, offer and exciting promotional
            discount..
          </p>

          {/* Email Input Field */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Subscribe Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeForNewsLetter;


