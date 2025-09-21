import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./admin/ui/card";
import { AlertTriangle } from "lucide-react";

// Placeholder hooks
const useAuth = () => ({
  user: { id: "user123", role: "admin" }, // Mock logged-in user
});

const useHasPermission = (permission) => {
  // Mock permission check - always return true for demo
  return true;
};

export default function ProtectedRoute({
  children,
  requiredPermission,
  fallback,
}) {
  const { user } = useAuth();
  const hasAccess = useHasPermission(requiredPermission || "");

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You must be logged in to access this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (requiredPermission && !hasAccess) {
    return (
      fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription>
              You don't have permission to access this feature. Contact your
              administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    );
  }

  return <>{children}</>;
}
