import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";
import { UserRole } from "@/utils/permissions";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export const userService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<{ data: UserProfile }>(
      API_ENDPOINTS.users.profile(userId)
    );
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    const response = await api.put<{ data: UserProfile }>(
      API_ENDPOINTS.users.update(userId),
      data
    );
    return response.data;
  },

  /**
   * Get skills offered by a user
   */
  async getUserSkills(userId: string) {
    return api.get(API_ENDPOINTS.users.skills(userId));
  },
};
