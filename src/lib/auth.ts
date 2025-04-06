import { API_ENDPOINTS } from "@/config/api";
import { UserRole } from "@/utils/permissions";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken?: string;
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
      const errorText = await response.text();
      console.error(
        `Authentication failed with status ${response.status}: ${errorText}`
      );
      throw new Error(
        `Authentication failed: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();

    // Check if the response has the expected structure
    if (!responseData.data || !responseData.data.user) {
      console.error("Authentication response missing user data:", responseData);
      throw new Error("Invalid response format: missing user data");
    }

    const { data } = responseData;

    // Map the backend response to the expected User format
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      // Default to USER role if not provided by backend
      role: UserRole.USER,
      // Use the token from the backend as the accessToken
      accessToken: data.token,
    };

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
