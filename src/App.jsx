import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

import HeroSection from "./pages/HeroSection";
import FeatureProduct from "./pages/FeatureProduct";
import MonthlySale from "./pages/MonthlySale";
import BlackFridaySales from "./pages/BlackFridaySales";
import Laptop from "./pages/Laptop";
import NewProduct from "./pages/NewProduct";
import FlashSaleContainer from "./pages/FlashSaleContainer";
import CartPage from "./components/CartPage";
import Wishlist from "./pages/WishList";
import HomeProduct from "./pages/HomeProduct";
import ProductDetail from "./pages/ProductDetail";
import TestPageSlider from "./pages/TestPageSlider";
import ProductLayout from "./layouts/ProductLayout";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <FeatureProduct />
              <MonthlySale />
              <BlackFridaySales />
              <Laptop />
              <NewProduct />
              <FlashSaleContainer />
            </>
          }
        />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Products routes with nested layout */}
        <Route path="/products" element={<ProductLayout />}>
          <Route index element={<HomeProduct />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
