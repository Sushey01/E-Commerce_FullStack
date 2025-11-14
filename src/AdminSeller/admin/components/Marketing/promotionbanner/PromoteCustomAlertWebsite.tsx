// PromoteCustomAlertWebsite.tsx
import React from 'react';

// This is often a temporary banner, so a dismiss button is necessary
interface PromoteCustomAlertWebsiteProps {
    onClose: () => void;
}

const PromoteCustomAlertWebsite: React.FC<PromoteCustomAlertWebsiteProps> = ({ onClose }) => {
    return (
        <div className="relative  w-full max-w-xs rounded-lg shadow-xl bg-gray-700 text-white p-4 mb-4">
            
            {/* Orange NEW Tag (Top Left Corner) */}
            <div className="absolute top-[-15px] left-[-15px] transform rotate-[-10deg]">
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NEW
                </div>
            </div>

            {/* Close Button (Top Right Corner) */}
            <button
                onClick={onClose}
                className="absolute top-1 right-1 p-1 text-gray-300 hover:text-white transition"
                aria-label="Dismiss Alert"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            {/* Content */}
            <p className="text-sm mt-2">
                Introducing **Dynamic Custom Alerts!** With custom trigger.
            </p>
        </div>
    );
};

export default PromoteCustomAlertWebsite;