import React, { useEffect } from "react";
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
import UserProfilePage from "./components/UserProfilePage";
import AddressBook from "./components/profile/AddressBook";
import OrdersAndPayments from "./components/profile/OrdersAndPayments";
import MyReviews from "./components/profile/MyReviews";
import MyReturns from "./components/profile/MyReturns";
import MyCancellations from "./components/profile/MyCancellations";
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
import SubCategories from "./category/SubCategories";
import CategorySliderDynamic from "./category/CategorySliderDynamic";
// import SubcategoryPage from "./category/SubCategoryPage";
import SubsubcategoryPage from "./category/SubsubCategories";
import AdminDashboard from "./AdminSeller/admin/AdminDashboard";
import AnalyticsCharts from "./AdminSeller/admin/Analytic-Charts";
import DashboardLayout from "./AdminSeller/admin/Dashboard-Layout";
import AdminRoutes from "./AdminSeller/admin/AdminRoutes";
import RoleBasedRedirect from "./AdminSeller/admin/RoleBasedRedirect";
import SellerForm from "./AdminSeller/seller/SellerForm";
import HomePage from "./AdminSeller/app/Page";
import SignupPage from "./components/SignupPage";
import SellerVerificationForm from "./AdminSeller/seller/components/SellerVerificationForm";
import ShowStepWisePopUp from "./AdminSeller/admin/components/Marketing/ShowStepWisePopUp";
import LiveOrderPopups from "./AdminSeller/admin/components/Marketing/LiveOrderPopups";
import CookiesPopUp from "./AdminSeller/admin/components/Marketing/CookiesPopUp";
import TripleDynamicPopUp from "./AdminSeller/admin/components/Marketing/TripleDynamicPopUp";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ReactGA from "react-ga4";
import usePageTracking from "./GA_Hook/usePageTracking";

const App = () => {
  // Initialize Google Analytics once when app mounts
  useEffect(() => {
    ReactGA.initialize("G-79RWGSTM8R");
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Separate component to use hooks that depend on Router
const AppContent = () => {
  // Track route changes (must be inside Router)
  usePageTracking();

  return (
    <Routes>
      {/* Admin Dashboard Routes - Completely separate UI */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/role-layout" element={<RoleBasedRedirect />} />

      {/* Seller Dashboard Route - Uses unified DashboardLayout */}
      <Route path="/seller/dashboard" element={<DashboardLayout />} />
      <Route path="/seller/vform" element={<SellerVerificationForm />} />

      {/* Customer UI Routes - With Navbar and Footer */}
      <Route
        path="/*"
        element={
          <main className="max-w-[1400px] mx-auto w-full">
            <Navbar />

            {/* GLOBAL POPUPS */}
            <ShowStepWisePopUp />
            <LiveOrderPopups />
            <CookiesPopUp />
            <TripleDynamicPopUp />

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
              <Route path="/profile" element={<ProfileSection />}>
                {/* Default profile content */}
                <Route index element={<UserProfilePage />} />
                {/* Sub-pages */}
                <Route path="address-book" element={<AddressBook />} />
                <Route path="payment-orders" element={<OrdersAndPayments />} />
                <Route path="my-reviews" element={<MyReviews />} />
                <Route path="my-returns" element={<MyReturns />} />
                <Route path="my-cancellations" element={<MyCancellations />} />
                <Route path="become-seller" element={<SellerForm />} />
              </Route>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/loginPage" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/become-seller" element={<SellerForm />} />
              <Route path="/messages" element={<CustomerCareChat />} />
              <Route path="order" element={<OrderPage />} />
              <Route path="payment" element={<CheckoutPayment />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="success" element={<OrderSuccessDetail />} />
              <Route path="cookie-policy" element={<PrivacyPolicy />} />

              {/* Product Detail */}
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Category  */}
              <Route path="/subcategory" element={<SubCategories />} />
              <Route path="/subsubcategory" element={<SubsubcategoryPage />} />

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
        }
      />
    </Routes>
  );
};

export default App;
