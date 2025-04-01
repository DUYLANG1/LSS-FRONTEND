import { API_ENDPOINTS } from "@/config/api";

export interface Skill {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  level?: string; // Added optional level property
  user: {
    id: string;
    name: string;
  };
  category: {
    name: string;
  };
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
  // Merged getAll method that handles all parameter types
  async getAll(
    params?:
      | Record<string, any>
      | { page?: number; limit?: number; search?: string; category?: string }
  ): Promise<SkillsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API_ENDPOINTS.skills.list}?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();
      // Handle empty response gracefully
      return {
        skills: data.skills || [],
        totalCount: data.meta?.total || 0,
      };
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new Error("Failed to fetch skills. Please try again later.");
    }
  },

  async create(data: CreateSkillData) {
    try {
      const response = await fetch(API_ENDPOINTS.skills.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies if using session auth
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.categoryId, // Make sure field name matches API expectation
          userId: data.userId,
        }),
      });

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create skill");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Skill creation error:", error);
      throw error;
    }
  },

  async getById(id: string) {
    const response = await fetch(API_ENDPOINTS.skills.getById(id));

    if (!response.ok) {
      throw new Error("Failed to fetch skill");
    }

    return response.json();
  },

  async update(id: string, data: CreateSkillData) {
    try {
      const response = await fetch(API_ENDPOINTS.skills.update(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update skill");
      }
  
      return response.json();
    } catch (error) {
      console.error("Error updating skill:", error);
      throw error;
    }
  }
};
