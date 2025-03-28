import { ReactNode } from "react";
import {
  UserRole,
  hasPermission,
  PermissionKey,
} from "../../utils/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  permission: PermissionKey;
  userRole: UserRole;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  userRole,
  fallback = null,
}: PermissionGuardProps) {
  if (!hasPermission(userRole, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
