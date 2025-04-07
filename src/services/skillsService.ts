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
      // Get the session to access the token, similar to the create method
      const session = await import("next-auth/react").then((mod) =>
        mod.getSession()
      );

      // Build URL with query parameters
      const url = new URL(API_ENDPOINTS.skills.list);

      // Set default limit to 9 cards per page
      const defaultLimit = 9;

      // Add query parameters if provided
      if (params) {
        // Apply default limit if not specified
        const paramsWithDefaults = {
          limit: defaultLimit,
          ...params,
        };

        Object.entries(paramsWithDefaults).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      } else {
        // If no params provided, still add the default limit
        url.searchParams.append("limit", String(defaultLimit));
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken
            ? {
                Authorization: `Bearer ${session.accessToken}`,
              }
            : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Check if the response has the expected structure with pagination metadata
      if (responseData && responseData.data) {
        // Extract skills data and pagination metadata from the response
        const skillsData = Array.isArray(responseData.data)
          ? responseData.data
          : [];
        const paginationMeta = responseData.meta || {};

        // Calculate total count and pages if not provided by the backend
        const totalItems = paginationMeta.total || skillsData.length;
        const totalPages =
          paginationMeta.totalPages ||
          Math.max(1, Math.ceil(totalItems / (params?.limit || defaultLimit)));

        // Transform the response to match our expected format
        return {
          skills: skillsData.map((skill: any) => ({
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
          totalCount: totalItems,
          meta: {
            total: totalItems,
            page: paginationMeta.page || params?.page || 1,
            limit: paginationMeta.limit || params?.limit || defaultLimit,
            totalPages: totalPages,
          },
        };
      }

      // Handle the case where the response is just an array of skills without metadata
      else if (responseData && Array.isArray(responseData)) {
        const skillsData = responseData;
        const totalItems = skillsData.length;

        // For this case, we need to estimate the total count based on the current page
        // If we're on page 1 and got less than the limit, this is likely all the data
        // Otherwise, we need to make an educated guess
        const currentPage = params?.page || 1;
        const currentLimit = params?.limit || defaultLimit;
        const isLastPage = skillsData.length < currentLimit;

        // Estimate total count - if it's the last page, we can calculate it precisely
        // Otherwise, we make a minimum estimate based on what we know
        const estimatedTotal =
          isLastPage && currentPage > 1
            ? (currentPage - 1) * currentLimit + skillsData.length
            : Math.max(totalItems, currentPage * currentLimit);

        const totalPages = Math.max(
          1,
          Math.ceil(estimatedTotal / currentLimit)
        );

        return {
          skills: skillsData.map((skill: any) => ({
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
          totalCount: estimatedTotal,
          meta: {
            total: estimatedTotal,
            page: currentPage,
            limit: currentLimit,
            totalPages: totalPages,
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
          limit: params?.limit || 9,
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
          limit: params?.limit || 9,
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
