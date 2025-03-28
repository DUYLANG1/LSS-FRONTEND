import { UserRole } from "../../utils/permissions";
import { PermissionGuard } from "../permissions/PermissionGuard";
import { UserList } from "../user/UserList";

interface DashboardProps {
  userRole: UserRole;
  totalUsers: number;
  activeExchanges: number;
  totalSkills: number;
  users: any[];
  handleBanUser: (userId: string) => void;
}

export function Dashboard({
  userRole,
  totalUsers,
  activeExchanges,
  totalSkills,
  users,
  handleBanUser,
}: DashboardProps) {
  return (
    <div className="dashboard">
      {/* Content visible to all users */}
      <section className="common-content">
        <h2>Welcome to Dashboard</h2>
        <div className="posts-list">{/* Regular content here */}</div>
      </section>

      {/* Admin-only metrics section */}
      <PermissionGuard
        permission="viewMetrics"
        userRole={userRole}
        fallback={<p>You don't have access to view metrics</p>}
      >
        <section className="metrics">
          <h3>Site Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>Total Users: {totalUsers}</div>
            <div>Active Exchanges: {activeExchanges}</div>
            <div>Total Skills: {totalSkills}</div>
          </div>
        </section>
      </PermissionGuard>

      {/* Admin-only user management */}
      <PermissionGuard permission="viewAllUsers" userRole={userRole}>
        <section className="user-management">
          <h3>User Management</h3>
          <UserList users={users} onBanUser={handleBanUser} />
        </section>
      </PermissionGuard>
    </div>
  );
}
