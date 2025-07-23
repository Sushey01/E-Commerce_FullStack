import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import FeatureCard from "./components/FeatureCard";
import FeatureProduct from "./pages/FeatureProduct";

const App = () => {
  return (
    <>
      {/* <Navbar />
      <HeroSection /> */}
      {/* <FeatureCard/> */}
      <FeatureProduct/>
    </>
  );
};

export default App;
