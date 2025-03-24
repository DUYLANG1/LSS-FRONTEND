export enum UserRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export const Permissions = {
  [UserRole.MEMBER]: {
    viewContent: true,
    createPosts: true,
    editOwnPosts: true,
    deleteOwnPosts: true,
  },
  [UserRole.ADMIN]: {
    viewContent: true,
    createPosts: true,
    editOwnPosts: true,
    deleteOwnPosts: true,
    viewAllUsers: true,
    monitorActivity: true,
    editAnyPost: true,
    deleteAnyPost: true,
    viewMetrics: true,
  },
} as const;

export type PermissionKey = keyof (typeof Permissions)[UserRole.ADMIN];

export function hasPermission(
  userRole: UserRole,
  permission: PermissionKey
): boolean {
  return Boolean(Permissions[userRole] && permission in Permissions[userRole]);
}
