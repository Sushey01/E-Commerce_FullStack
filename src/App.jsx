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
import FilterByCategories from "./components/FilterByCategories";
import HomeProductHead from "./ui/HomeProductHead";
import HomeProductFilterSort from "./components/HomeProductFilterSort";
import HomeProduct from "./pages/HomeProduct";
import ProductDetailPhoto from "./components/ProductDetailPhoto";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetail from "./pages/ProductDetail";


const App = () => {
  return (
    <>
      <Navbar />
      {/* <HeroSection /> */}
      {/* <FeatureProduct/> */}
      {/* <MonthlySale/> */}
      {/* <BlackFridaySales/> */}
      {/* <Laptop/>
      <NewProduct/>
      <FlashSaleContainer/>
     <Footer/> */}
     {/* <CartPage/>
     <Wishlist/> */}

     {/* <HomeProduct/>
     <ProductDetail/> */}
    </>
  );
};

export default App;
