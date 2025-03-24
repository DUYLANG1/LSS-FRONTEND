import { UserRole, hasPermission, PermissionKey } from "../utils/permissions";

export function usePermissions(userRole: UserRole) {
  return {
    can: (permission: PermissionKey) => hasPermission(userRole, permission),
    role: userRole,
  };
}
