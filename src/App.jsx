import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import FeatureProduct from "./pages/FeatureProduct";
import MonthlySale from "./pages/MonthlySale";
import BlackFridaySales from "./pages/BlackFridaySales";
import Laptop from "./pages/Laptop";

const App = () => {
  return (
    <>
      {/* <Navbar />
      <HeroSection /> */}
      <FeatureProduct/>
      <MonthlySale/>
      <BlackFridaySales/>
      <Laptop/>
    </>
  );
};

export default App;
