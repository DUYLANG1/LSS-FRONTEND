import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  level?: SkillLevel;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface CreateSkillData {
  title: string;
  description: string;
  categoryId: string;
  level?: SkillLevel;
}

export interface UpdateSkillData {
  title?: string;
  description?: string;
  categoryId?: string;
  level?: SkillLevel;
}

export interface SkillsResponse {
  skills: Skill[];
  totalCount: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SkillsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  userId?: string;
}

export const skillsService = {
  /**
   * Get all skills with optional filtering
   */
  async getAll(params?: SkillsQueryParams): Promise<SkillsResponse> {
    try {
      const response = await api.get<any>(API_ENDPOINTS.skills.list, {
        params,
      });

      // Handle the actual response format from the backend
      // The backend returns { data: Skill[] } instead of { skills: Skill[], totalCount, meta }
      if (response && response.data && Array.isArray(response.data)) {
        // Transform the response to match our expected format
        return {
          skills: response.data.map((skill: any) => ({
            id: skill.id,
            title: skill.title,
            description: skill.description,
            categoryId: skill.categoryId,
            userId: skill.userId,
            createdAt: skill.createdAt,
            level: skill.level,
            user: {
              id: skill.user?.id,
              name: skill.user?.name,
              avatarUrl: skill.user?.avatar,
            },
            category: {
              id: skill.category?.id,
              name: skill.category?.name,
            },
          })),
          totalCount: response.data.length,
          meta: {
            total: response.data.length,
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: Math.max(
              1,
              Math.ceil(response.data.length / (params?.limit || 10))
            ),
          },
        };
      }

      // Fallback to default response if the format is unexpected
      return {
        skills: [],
        totalCount: 0,
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 1, // Always at least 1 page
        },
      };
    } catch (error) {
      console.error("Error fetching skills:", error);
      // Return a default empty response on error
      return {
        skills: [],
        totalCount: 0,
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 1, // Always at least 1 page
        },
      };
    }
  },

  /**
   * Create a new skill
   */
  async create(data: CreateSkillData, userId: string): Promise<Skill> {
    try {
      // Try a direct fetch approach with full control over the request
      const session = await import("next-auth/react").then((mod) =>
        mod.getSession()
      );

      const response = await fetch(API_ENDPOINTS.skills.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken
            ? {
                Authorization: `Bearer ${session.accessToken}`,
              }
            : {}),
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          level: data.level,
          // userId is automatically extracted from the JWT token
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to create skill: ${response.status} ${response.statusText}`;

        try {
          // Try to parse the error response as JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Skill creation failed:", errorData);

            // Extract error message from response if available
            if (errorData.message) {
              errorMessage = Array.isArray(errorData.message)
                ? errorData.message.join(", ")
                : errorData.message;
            } else if (errorData.error) {
              errorMessage = Array.isArray(errorData.error)
                ? errorData.error.join(", ")
                : errorData.error;
            }
          } else {
            const errorText = await response.text();
            console.error(
              `Skill creation failed: ${response.status} - ${errorText}`
            );
            if (errorText) {
              errorMessage += ` - ${errorText}`;
            }
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        console.error("Skill creation error details:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
        });

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      // Process the response data
      // Handle different response formats: { data: Skill } or just Skill
      const skill = responseData.data || responseData;

      console.log("Skill creation response data:", responseData);

      if (!skill || !skill.id) {
        console.error("Invalid skill data received:", responseData);
        throw new Error("Invalid skill data received");
      }

      return {
        id: skill.id,
        title: skill.title,
        description: skill.description,
        categoryId: skill.categoryId,
        userId: skill.userId,
        createdAt: skill.createdAt,
        level: skill.level,
        user: {
          id: skill.user?.id,
          name: skill.user?.name,
          avatarUrl: skill.user?.avatar,
        },
        category: {
          id: skill.category?.id,
          name: skill.category?.name,
        },
      };
    } catch (error) {
      console.error("Error creating skill:", error);
      throw error;
    }
  },

  /**
   * Get a skill by ID
   */
  async getById(id: string): Promise<Skill> {
    try {
      const response = await api.get<any>(API_ENDPOINTS.skills.getById(id));

      // Handle the case where the API returns { data: Skill } instead of just Skill
      if (response && response.data) {
        const skill = response.data;
        return {
          id: skill.id,
          title: skill.title,
          description: skill.description,
          categoryId: skill.categoryId,
          userId: skill.userId,
          createdAt: skill.createdAt,
          level: skill.level,
          user: {
            id: skill.user?.id,
            name: skill.user?.name,
            avatarUrl: skill.user?.avatar,
          },
          category: {
            id: skill.category?.id,
            name: skill.category?.name,
          },
        };
      }

      throw new Error("Invalid skill data received");
    } catch (error) {
      console.error("Error fetching skill by ID:", error);
      throw error;
    }
  },

  /**
   * Update a skill
   */
  async update(id: string, data: UpdateSkillData): Promise<Skill> {
    try {
      // Transform data if needed for API compatibility
      const apiData = {
        ...data,
        category: data.categoryId, // API expects 'category' not 'categoryId'
      };

      delete apiData.categoryId;

      const response = await api.put<any>(
        API_ENDPOINTS.skills.update(id),
        apiData
      );

      // Handle the case where the API returns { data: Skill } instead of just Skill
      if (response && response.data) {
        const skill = response.data;
        return {
          id: skill.id,
          title: skill.title,
          description: skill.description,
          categoryId: skill.categoryId,
          userId: skill.userId,
          createdAt: skill.createdAt,
          level: skill.level,
          user: {
            id: skill.user?.id,
            name: skill.user?.name,
            avatarUrl: skill.user?.avatar,
          },
          category: {
            id: skill.category?.id,
            name: skill.category?.name,
          },
        };
      }

      throw new Error("Invalid skill data received");
    } catch (error) {
      console.error("Error updating skill:", error);
      throw error;
    }
  },

  /**
   * Delete a skill
   */
  async delete(id: string): Promise<void> {
    return api.delete(API_ENDPOINTS.skills.delete(id));
  },
};
