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
            totalPages: Math.ceil(response.data.length / (params?.limit || 10)),
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
          totalPages: 0,
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
          totalPages: 0,
        },
      };
    }
  },

  /**
   * Create a new skill
   */
  async create(data: CreateSkillData): Promise<Skill> {
    try {
      const response = await api.post<any>(API_ENDPOINTS.skills.create, {
        title: data.title,
        description: data.description,
        category: data.categoryId, // API expects 'category' not 'categoryId'
        level: data.level,
      });

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
