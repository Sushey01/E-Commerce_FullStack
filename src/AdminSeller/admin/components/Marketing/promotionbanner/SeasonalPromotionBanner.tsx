// SeasonalPromotionBanner.tsx
import React from "react";
// @ts-ignore
import HeadPhone from "../../../../../assets/images/headphone.png";

// You would typically pass an onClose/onDismiss prop if the user can close this banner
interface SeasonalPromotionBannerProps {
  onClose?: () => void;
}

const SeasonalPromotionBanner: React.FC<SeasonalPromotionBannerProps> = ({
  onClose,
}) => {
  return (
    <div className="relative w-full max-w-xs rounded-lg shadow-xl overflow-hidden bg-white mb-4">
      {/* Image Header */}
      <div className="relative h-48 bg-yellow-200">
        {/* Placeholder Image of the person and clothes */}
        <img
          src={HeadPhone}
          alt="Huge Winter Sale"
          className="w-full h-full object-cover"
        />

        {/* Small Close Button on Image Header */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-white bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition"
            aria-label="Dismiss Promotion"
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

      {/* Hurry Up! Banner Text */}
      <div className="bg-gray-800 text-white p-4">
        <p className="text-lg font-bold mb-1">
          Hurry Up! The huge winter sale will end very soon.
        </p>
        <p className="text-sm">Click here to see if you need any products.</p>
      </div>
    </div>
  );
};

export default SeasonalPromotionBanner;
