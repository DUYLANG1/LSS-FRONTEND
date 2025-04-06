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
    return api.get<SkillsResponse>(API_ENDPOINTS.skills.list, { params });
  },

  /**
   * Create a new skill
   */
  async create(data: CreateSkillData): Promise<Skill> {
    return api.post<Skill>(API_ENDPOINTS.skills.create, {
      title: data.title,
      description: data.description,
      category: data.categoryId, // API expects 'category' not 'categoryId'
      level: data.level,
    });
  },

  /**
   * Get a skill by ID
   */
  async getById(id: string): Promise<Skill> {
    return api.get<Skill>(API_ENDPOINTS.skills.getById(id));
  },

  /**
   * Update a skill
   */
  async update(id: string, data: UpdateSkillData): Promise<Skill> {
    // Transform data if needed for API compatibility
    const apiData = {
      ...data,
      category: data.categoryId, // API expects 'category' not 'categoryId'
    };

    delete apiData.categoryId;

    return api.put<Skill>(API_ENDPOINTS.skills.update(id), apiData);
  },

  /**
   * Delete a skill
   */
  async delete(id: string): Promise<void> {
    return api.delete(API_ENDPOINTS.skills.delete(id));
  }
};
