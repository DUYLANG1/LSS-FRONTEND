"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/utils/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    router.push("/auth/signin");
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    router.push("/dashboard");
    return null;
  }

  return <>{children}</>;
}
