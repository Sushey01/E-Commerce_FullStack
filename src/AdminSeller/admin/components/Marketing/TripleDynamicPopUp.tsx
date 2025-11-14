import React, { useState, useEffect } from "react";
import NewGadgetAlertPromotion from "./promotionbanner/NewGadgetAlertPromotion";
import PromoteCustomAlertWebsite from "./promotionbanner/PromoteCustomAlertWebsite";
import SeasonalPromotionBanner from "./promotionbanner/SeasonalPromotionBanner";

interface TripleDynamicPopUpProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Define the component
const TripleDynamicPopUp: React.FC<TripleDynamicPopUpProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) => {
  // State to manage the visibility of the three individual banners
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isSeasonalVisible, setIsSeasonalVisible] = useState(true);
  const [isGadgetVisible, setIsGadgetVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState("bottom-5");

  useEffect(() => {
    // Always use parent's isOpen prop
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Check for cookies and order popups to adjust position
  useEffect(() => {
    const checkBottomPopups = () => {
      const cookiesAccepted = localStorage.getItem("cookiesAccepted");
      const isCookiesVisible = cookiesAccepted !== "true";
      const orderPopup = document.querySelector('[class*="animate-slideIn"]');
      const isOrderVisible = !!orderPopup;

      // Adjust position based on what's visible at the bottom
      if (isCookiesVisible && isOrderVisible) {
        setBottomOffset("bottom-[220px] md:bottom-[180px]");
      } else if (isCookiesVisible || isOrderVisible) {
        setBottomOffset("bottom-[140px]");
      } else {
        setBottomOffset("bottom-5");
      }
    };

    checkBottomPopups();
    const interval = setInterval(checkBottomPopups, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle when all individual banners are closed
  const handleAllClosed = () => {
    setIsOpen(false);
    // Parent (ShowStepWisePopUp) handles localStorage
    if (externalOnClose) {
      externalOnClose();
    }
  };

  // Check if all banners are dismissed
  useEffect(() => {
    if (!isAlertVisible && !isSeasonalVisible && !isGadgetVisible) {
      handleAllClosed();
    }
  }, [isAlertVisible, isSeasonalVisible, isGadgetVisible]);

  if (!isOpen) {
    return null;
  }

  // Positioning the pop-ups on the left side with fixed positioning
  return (
    // Banners positioned fixed at bottom-left, above all overlays with dynamic positioning
    <div
      className={`fixed ${bottomOffset} left-3 z-[9999] flex flex-col items-start space-y-4 transition-all duration-300`}
      aria-live="polite" // Important for accessibility for dynamic content
    >
      {/* 1. Top Alert Box (PromoteCustomAlertWebsite) */}
      {isAlertVisible && (
        <PromoteCustomAlertWebsite onClose={() => setIsAlertVisible(false)} />
      )}

      {/* 2. Middle Banner (SeasonalPromotionBanner) */}
      {isSeasonalVisible && (
        <SeasonalPromotionBanner onClose={() => setIsSeasonalVisible(false)} />
      )}

      {/* 3. Bottom Banner (NewGadgetAlertPromotion) */}
      {isGadgetVisible && (
        <NewGadgetAlertPromotion onClose={() => setIsGadgetVisible(false)} />
      )}
    </div>
  );
};

export default TripleDynamicPopUp;
