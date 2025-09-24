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
import CustomerCareChat from "./components/CustomerCareChat";
import HoverAddCartWishShare from "./components/HoverAddCartWishShare";
import MonthlySalePageRedux from "./pages/MonthlySalePageRedux";
import OrderPage from "./order/OrderPage";
import OrderContactForm from "./order/OrderContactForm";
import OrderCartPaymentProcess from "./order/OrderCartPaymentProcess";
import CheckoutPayment from "./order/CheckoutPayment";
import Invoice from "./components/Invoice";
import OrderSuccessDetail from "./order/OrderSuccessDetail";
import CategorySlider from "./category/CategorySlider";
import SubCategories from "./category/SubCategories";
import CategorySliderDynamic from "./category/CategorySliderDynamic";
// import SubcategoryPage from "./category/SubCategoryPage";
import SubsubcategoryPage from "./category/SubsubCategories";
import AdminDashboard from "./AdminSeller/admin/AdminDashboard";
import AnalyticsCharts from "./AdminSeller/admin/Analytic-Charts";
import DashboardLayout from "./AdminSeller/admin/Dashboard-Layout";
import SellerDashboard from "./AdminSeller/seller/SellerDashboard";
import SellerRequestForm from "./AdminSeller/seller/Seller-Request-Form";
import HomePage from "./AdminSeller/app/Page";
import SignupPage from "./components/SignupPage";

const App = () => {
  return (
    <Router>
      <main className="max-w-[1400px] mx-auto w-full">
        <Navbar />

        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
                <div className="px-0 lg:px-6">
                  <HeroSection />
                  {/* <CategoryPage /> */}
                  <CategorySliderDynamic />
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
          <Route path="/register" element={<SignupPage />} />
          <Route path="/become-seller" element={<SellerRequestForm />} />
          <Route path="/messages" element={<CustomerCareChat />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="payment" element={<CheckoutPayment />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="success" element={<OrderSuccessDetail />} />

          {/* Product Detail */}
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Category  */}
          <Route path="/subcategory" element={<SubCategories />} />
          <Route path="/subsubcategory" element={<SubsubcategoryPage />} />
          {/* <Route path="/subsubcategory" element={<SubsubcategoryPage />} /> */}

          {/* Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Product Listing Pages (nested) */}
          <Route path="/products" element={<ProductLayout />}>
            <Route index element={<HomeProduct />} />
            <Route path=":id" element={<ProductDetail />} />
          </Route>
        </Routes>

        <Footer />
      </main>
    </Router>
    //  <Router>
    //     {/* <AdminDashboard/> */}
    //       {/* <AnalyticsCharts/> */}
    //     {/* <SellerDashboard /> */}
    //     {/* <DashboardLayout/> */}
    //   </Router>
  );
};

export default App;
