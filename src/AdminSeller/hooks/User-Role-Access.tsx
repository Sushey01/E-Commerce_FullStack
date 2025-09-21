import { useAuth, type UserRole } from "../contexts/Auth-Context";

interface RolePermissions {
  canViewAllSellers: boolean;
  canManageAllProducts: boolean;
  canViewSystemAnalytics: boolean;
  canAccessSystemSettings: boolean;
  canManageOwnProducts: boolean;
  canViewOwnSales: boolean;
  canEditProfile: boolean;
}

export function useRoleAccess(): RolePermissions {
  const { user } = useAuth();

  const permissions: Record<UserRole, RolePermissions> = {
    admin: {
      canViewAllSellers: true,
      canManageAllProducts: true,
      canViewSystemAnalytics: true,
      canAccessSystemSettings: true,
      canManageOwnProducts: true,
      canViewOwnSales: true,
      canEditProfile: true,
    },
    seller: {
      canViewAllSellers: false,
      canManageAllProducts: false,
      canViewSystemAnalytics: false,
      canAccessSystemSettings: false,
      canManageOwnProducts: true,
      canViewOwnSales: true,
      canEditProfile: true,
    },
    pending_seller: {
      canViewAllSellers: false,
      canManageAllProducts: false,
      canViewSystemAnalytics: false,
      canAccessSystemSettings: false,
      canManageOwnProducts: false,
      canViewOwnSales: false,
      canEditProfile: true,
    },
  };

  return user?.role ? permissions[user.role] : permissions.seller;
}

export function useCanAccess(): RolePermissions {
  return useRoleAccess();
}

export function useHasPermission(permission: keyof RolePermissions): boolean {
  const permissions = useRoleAccess();
  return permissions[permission];
}
