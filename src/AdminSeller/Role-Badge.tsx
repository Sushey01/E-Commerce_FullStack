import { Badge } from "./admin/ui/badge";
import { Shield, User } from "lucide-react";

// Placeholder hook
const useAuth = () => ({
  user: { role: "admin" as "admin" | "seller" },
});

interface RoleBadgeProps {
  showIcon?: boolean;
  variant?: "default" | "inactive" | "outOfStock" | "completed" | "pending";
}

export default function RoleBadge({
  showIcon = true,
  variant = "default",
}: RoleBadgeProps) {
  const { user } = useAuth();

  if (!user) return null;

  // Map roles to allowed Badge variants
  const roleConfig = {
    admin: {
      label: "Administrator",
      icon: Shield,
      variant: "default" as const, // dark grey
    },
    seller: {
      label: "Seller",
      icon: User,
      variant: "inactive" as const, // blue
    },
  };

  const config = roleConfig[user.role];
  const Icon = config.icon;

  return (
    <Badge
      variant={variant === "default" ? config.variant : variant}
      className="flex items-center gap-1"
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
