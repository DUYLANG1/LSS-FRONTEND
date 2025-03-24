"use client";
import { Dashboard } from "@/components/Dashboard";
import { UserRole } from "@/utils/permissions";
import { useState } from "react";

export default function AdminTest() {
  const [role, setRole] = useState<UserRole>(UserRole.MEMBER);

  // Mock data for testing
  const mockData = {
    totalUsers: 150,
    activeExchanges: 45,
    totalSkills: 200,
    users: [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
    ],
    handleBanUser: (userId: string) => console.log("Ban user:", userId),
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setRole(UserRole.ADMIN)}
          className={`mr-2 px-4 py-2 rounded ${
            role === UserRole.ADMIN ? "bg-blue-500 text-white" : "bg-gray-500"
          }`}
        >
          Admin View
        </button>
        <button
          onClick={() => setRole(UserRole.MEMBER)}
          className={`px-4 py-2 rounded ${
            role === UserRole.MEMBER ? "bg-blue-500 text-white" : "bg-gray-500"
          }`}
        >
          Member View
        </button>
      </div>

      <Dashboard userRole={role} {...mockData} />
    </div>
  );
}
