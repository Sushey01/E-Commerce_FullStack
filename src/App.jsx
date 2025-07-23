import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import FeatureProduct from "./pages/FeatureProduct";
import MonthlySale from "./pages/MonthlySale";

const App = () => {
  return (
    <>
      {/* <Navbar />
      <HeroSection /> */}
      <FeatureProduct/>
      <MonthlySale/>
    </>
  );
};

export default App;
