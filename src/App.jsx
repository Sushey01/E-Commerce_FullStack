import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import FeatureProduct from "./pages/FeatureProduct";
import MonthlySale from "./pages/MonthlySale";
import BlackFridaySales from "./pages/BlackFridaySales";
import Laptop from "./pages/Laptop";
import NewProduct from "./pages/NewProduct";
import FlashSaleContainer from "./pages/FlashSaleContainer";
import FlashSaleSlider from "./components/FlashSaleSlider";
import Footer from "./pages/Footer";
import CartPage from "./components/CartPage";
import Wishlist from "./pages/WishList";


const App = () => {
  return (
    <>
      {/* <Navbar />
      <HeroSection />
      <FeatureProduct/>
      <MonthlySale/>
      <BlackFridaySales/>
      <Laptop/>
      <NewProduct/>
      <FlashSaleContainer/>
     <Footer/> */}
     <CartPage/>
     <Wishlist/>
    </>
  );
};

export default App;
