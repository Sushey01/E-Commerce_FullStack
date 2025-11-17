import React, { useEffect, useState } from "react";
import WelcomePopUp from "./WelcomePopUp";
import SubscribeForNewsLetter from "./SubscribeForNewsLetter";

const ShowStepWisePopUp = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check localStorage to see if popups should be shown
    const welcomeLastShown = localStorage.getItem("welcomePopUpLastShown");
    const newsletterLastShown = localStorage.getItem("newsletterLastShown");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in ms

    // Only show welcome popup if it hasn't been shown in the last hour
    if (!welcomeLastShown || now - parseInt(welcomeLastShown) > oneHour) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
    // If welcome was recently shown, check if newsletter should be shown
    else if (
      !newsletterLastShown ||
      now - parseInt(newsletterLastShown) > oneHour
    ) {
      const timer = setTimeout(() => setStep(2), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseStep1 = () => {
    localStorage.setItem("welcomePopUpLastShown", Date.now().toString());

    // Check if newsletter should be shown
    const newsletterLastShown = localStorage.getItem("newsletterLastShown");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!newsletterLastShown || now - parseInt(newsletterLastShown) > oneHour) {
      setStep(2); // show next modal
    } else {
      setStep(0); // don't show anything
    }
  };

  const handleCloseStep2 = () => {
    localStorage.setItem("newsletterLastShown", Date.now().toString());
    setStep(0);
  };

  return (
    <>
      <WelcomePopUp isOpen={step === 1} onClose={handleCloseStep1} />
      <SubscribeForNewsLetter isOpen={step === 2} onClose={handleCloseStep2} />
    </>
  );
};

export default ShowStepWisePopUp;
