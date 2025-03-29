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
};
