import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./Dashboard-Layout";

// Admin routes with optional params to locate current navigation (tab/sub)
// Examples:
//   /admin -> redirects to /admin/dashboard
//   /admin/sales -> opens Sales
//   /admin/sales/unpaid-orders -> opens Sales > Unpaid Orders
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path=":tab" element={<DashboardLayout />} />
      <Route path=":tab/:sub" element={<DashboardLayout />} />
      {/* Fallback to dashboard for unknown paths */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
