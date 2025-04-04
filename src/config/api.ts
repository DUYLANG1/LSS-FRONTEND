export const API_BASE_BACKEND = "http://localhost:4000";

export const API_ENDPOINTS = {
  auth: {
    signin: `${API_BASE_BACKEND}/auth/signin`,
    signup: `${API_BASE_BACKEND}/auth/signup`,
  },
  skills: {
    list: `${API_BASE_BACKEND}/skills`,
    create: `${API_BASE_BACKEND}/skills`,
    getById: (id: string) => `${API_BASE_BACKEND}/skills/${id}`,
    update: (id: string) => `${API_BASE_BACKEND}/skills/${id}`,
    delete: (id: string) => `${API_BASE_BACKEND}/skills/${id}`,
  },
  categories: `${API_BASE_BACKEND}/categories`,
  users: {
    profile: (id: string) => `${API_BASE_BACKEND}/users/profile/${id}`,
    update: (id: string) => `${API_BASE_BACKEND}/users/profile/${id}`,
    skills: (id: string) => `${API_BASE_BACKEND}/users/skills/${id}`,
  },
  exchanges: {
    list: `${API_BASE_BACKEND}/exchanges`,
    create: `${API_BASE_BACKEND}/exchanges`,
    respond: (id: string) => `${API_BASE_BACKEND}/exchanges/${id}/respond`,
  },
};
