import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

import HeroSection from "./pages/HeroSection";
import BlackFridaySales from "./pages/BlackFridaySales";
import NewProduct from "./pages/NewProduct";
import FlashSaleContainer from "./pages/FlashSaleContainer";
import CartPage from "./components/CartPage";
import Wishlist from "./pages/WishList";
import HomeProduct from "./pages/HomeProduct";
import ProductDetail from "./pages/ProductDetail";
import ProductLayout from "./layouts/ProductLayout";
import DynamicPageSlider from "./pages/DynamicPageSlider";
import ProfileSection from "./pages/ProfileSection";
import CheckoutPage from "./checkout/CheckoutPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <div className="px-0 lg:px-6">
                <HeroSection />
                <CategoryPage />
                <DynamicPageSlider />
                <BlackFridaySales />
                <NewProduct />
                <FlashSaleContainer />
              </div>
            </>
          }
        />

        {/* Cart, Profile, Wishlist */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/loginPage" element={<LoginPage />} />

        {/* Product Detail */}
        <Route path="/details/:id" element={<ProductDetail />} />

        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />


      

        {/* Product Listing Pages (nested) */}
        <Route path="/products" element={<ProductLayout />}>
          <Route index element={<HomeProduct />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
    // <>
    // <CheckoutPage/>
    // </>
  );
};

export default App;
