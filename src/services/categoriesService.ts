import { API_ENDPOINTS } from "@/config/api";

export interface Category {
  id: string;
  name: string;
  count?: number; // Optional for when categories include count information
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(API_ENDPOINTS.categories);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },
};
