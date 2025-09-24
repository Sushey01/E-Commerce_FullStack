import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./Dashboard-Layout";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default admin route */}
      <Route path="/" element={<DashboardLayout />} />

      {/* Specific admin dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/sellers" element={<DashboardLayout />} />
      <Route path="/products" element={<DashboardLayout />} />
      <Route path="/analytics" element={<DashboardLayout />} />
      <Route path="/settings" element={<DashboardLayout />} />
      <Route path="/seller-requests" element={<DashboardLayout />} />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
