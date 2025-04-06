import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

export interface Category {
  id: string;
  name: string;
  count?: number; // Optional for when categories include count information
  description?: string;
  iconName?: string;
}

export const categoriesService = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    return api.get<Category[]>(API_ENDPOINTS.categories);
  },

  /**
   * Get popular categories (with highest skill counts)
   */
  async getPopular(limit: number = 5): Promise<Category[]> {
    return api.get<Category[]>(API_ENDPOINTS.categories, {
      params: { popular: true, limit }
    });
  }
};
