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
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
