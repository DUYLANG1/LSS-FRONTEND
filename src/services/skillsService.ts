import { API_ENDPOINTS } from "@/config/api";

export interface Skill {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  category: string;
}

export interface CreateSkillData {
  title: string;
  description: string;
  categoryId: string;
  userId: string;
}

export interface SkillsResponse {
  skills: Skill[];
  totalCount: number;
}

export const skillsService = {
  async getAll(params?: Record<string, any>): Promise<SkillsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
      }

      const response = await fetch(
        `${API_ENDPOINTS.skills.list}?${searchParams.toString()}`
      );
      console.log("searchParams", searchParams);

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();
      // Handle empty response gracefully
      return {
        skills: data.skills || [],
        totalCount: data.meta.total || 0,
      };
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new Error("Failed to fetch skills. Please try again later.");
    }
  },

  async create(data: CreateSkillData) {
    const response = await fetch(API_ENDPOINTS.skills.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create skill");
    }

    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(API_ENDPOINTS.skills.getById(id));

    if (!response.ok) {
      throw new Error("Failed to fetch skill");
    }

    return response.json();
  },
};
