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
    return api.get<UserProfile>(API_ENDPOINTS.users.profile(userId));
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    return api.put<UserProfile>(API_ENDPOINTS.users.update(userId), data);
  },

  /**
   * Get skills offered by a user
   */
  async getUserSkills(userId: string) {
    return api.get(API_ENDPOINTS.users.skills(userId));
  }
};