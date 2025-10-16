import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../../supabase";

const RoleBasedRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          // No user logged in, redirect to login
          setUserRole("guest");
          setLoading(false);
          return;
        }

        // Get user role from users table
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile && profile.role) {
          setUserRole(profile.role);
        } else {
          // Default to customer if no role found
          setUserRole("customer");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole("customer");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your access level...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === "seller") {
    return <Navigate to="/admin/dashboard" replace />; // Sellers also use admin dashboard but with different permissions
  } else if (userRole === "customer") {
    return <Navigate to="/" replace />;
  } else if (userRole === "guest") {
    // Customer or unknown role - redirect to home
    return <Navigate to="/" replace />;
  }
};

export default RoleBasedRedirect;
