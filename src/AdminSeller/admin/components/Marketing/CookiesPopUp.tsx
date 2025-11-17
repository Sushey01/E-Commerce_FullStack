import React, { useEffect } from "react";

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface CookiesProps {
  clicked: boolean;
}

const CookiesPopUp = () => {
  const [clicked, setClicked] = React.useState(false);
  const [isOrderPopupVisible, setIsOrderPopupVisible] = React.useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesAccepted");
    if (consent === "true") {
      setClicked(true);
      loadGoogleAnalytics(); // auto-load if previously accepted
    }

    // Check if order popup might be visible by checking DOM periodically
    const checkOrderPopup = () => {
      const orderPopup = document.querySelector('[class*="animate-slideIn"]');
      setIsOrderPopupVisible(!!orderPopup);
    };

    const interval = setInterval(checkOrderPopup, 500);
    return () => clearInterval(interval);
  }, []);

  function handleClick() {
    localStorage.setItem("cookiesAccepted", "true");
    loadGoogleAnalytics();
    setClicked(true);
  }

  function loadGoogleAnalytics() {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-79RWGSTM8R";
    script.async = true;

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments as any);
      };
      window.gtag("js", new Date());
      window.gtag("config", "G-79RWGSTM8R");
    };

    document.head.appendChild(script);
  }

  if (clicked) return null;

  // Position above order popup if it's visible
  const bottomClass = isOrderPopupVisible ? "bottom-[100px]" : "bottom-2";

  return (
    <div
      className={`flex-col p-3 px-6 fixed lg:w-[320px] left-3 ${bottomClass} border rounded-none bg-white w-full md:w-1/3 flex justify-between items-center gap-4 z-50 transition-all duration-300`}
    >
      <h1 className="text-gray-700 text-start font-inter text-sm">
        We use cookie for better user experience, check our policy
        <span>
          <a href="/cookie-policy" className="font-inter text-blue-500 ml-1">
            here
          </a>
        </span>
      </h1>
      <button
        type="button"
        onClick={handleClick}
        className="bg-blue-600 w-full font-inter  text-white p-2 px-4 border text-sm rounded-none text-center"
      >
        Ok, I Understood
      </button>
    </div>
  );
};

export default CookiesPopUp;
