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
}

export interface CreateSkillData {
  title: string;
  description: string;
  categoryId: string;
}

export const skillsService = {
  async getAll(params?: Record<string, any>) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(
      `${API_ENDPOINTS.skills.list}?${searchParams}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }

    return response.json();
  },

  async create(data: CreateSkillData) {
    const response = await fetch(API_ENDPOINTS.skills.create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create skill");
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
