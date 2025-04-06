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
    try {
      const response = await api.get<any>(API_ENDPOINTS.categories);

      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === "object") {
        // Try to extract data from other possible structures
        const possibleArrays = Object.values(response).filter((val) =>
          Array.isArray(val)
        );
        if (possibleArrays.length > 0) {
          return possibleArrays[0];
        }
      }

      // If we can't find a valid array, log the error and return empty array
      console.error("Unexpected categories response format:", response);
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  /**
   * Get popular categories (with highest skill counts)
   */
  async getPopular(limit: number = 5): Promise<Category[]> {
    try {
      const response = await api.get<any>(API_ENDPOINTS.categories, {
        params: { popular: true, limit },
      });

      // Use the same response handling logic as getAll
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === "object") {
        const possibleArrays = Object.values(response).filter((val) =>
          Array.isArray(val)
        );
        if (possibleArrays.length > 0) {
          return possibleArrays[0];
        }
      }

      console.error("Unexpected popular categories response format:", response);
      return [];
    } catch (error) {
      console.error("Error fetching popular categories:", error);
      return [];
    }
  },
};
