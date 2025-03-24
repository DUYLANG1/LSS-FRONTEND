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
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error("Auth response not ok:", response.status);
      return null;
    }

    const data = await response.json();
    return {
      ...data.user,
      role: data.user.role as UserRole,
    };
  } catch (error) {
    console.error("Auth fetch error:", error);
    return null;
  }
}

// Fetch skills
const fetchSkills = async (searchQuery?: string, category?: string) => {
  const response = await fetch(
    `${API_ENDPOINTS.skills.list}?search=${searchQuery}&category=${category}`
  );
  return response.json();
};

// Fetch admin metrics
const fetchMetrics = async () => {
  const response = await fetch(API_ENDPOINTS.admin.metrics);
  return response.json();
};

// Ban user
const banUser = async (userId: string) => {
  const response = await fetch(API_ENDPOINTS.users.ban(userId), {
    method: "POST",
  });
  return response.json();
};
