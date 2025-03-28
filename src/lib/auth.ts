import { API_ENDPOINTS } from "@/config/api";
import { UserRole } from "@/utils/permissions";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function validateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const response = await fetch(API_ENDPOINTS.auth.signin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    const data = await response.json();
    return {
      ...data.user,
      role: data.user.role as UserRole,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
