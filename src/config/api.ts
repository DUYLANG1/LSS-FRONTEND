export const API_BASE_BACKEND = "http://localhost:4000";
export const API_PREFIX = "api/v1";

export const API_ENDPOINTS = {
  auth: {
    signin: `${API_BASE_BACKEND}/${API_PREFIX}/auth/signin`,
    signup: `${API_BASE_BACKEND}/${API_PREFIX}/auth/signup`,
  },
  skills: {
    list: `${API_BASE_BACKEND}/${API_PREFIX}/skills`,
    create: `${API_BASE_BACKEND}/${API_PREFIX}/skills`,
    getById: (id: string) => `${API_BASE_BACKEND}/${API_PREFIX}/skills/${id}`,
    update: (id: string) => `${API_BASE_BACKEND}/${API_PREFIX}/skills/${id}`,
    delete: (id: string) => `${API_BASE_BACKEND}/${API_PREFIX}/skills/${id}`,
  },
  categories: `${API_BASE_BACKEND}/${API_PREFIX}/categories`,
  users: {
    profile: (id: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/users/profile/${id}`,
    update: (id: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/users/profile/${id}`,
    skills: (id: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/users/skills/${id}`,
  },
  exchanges: {
    list: (userId: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/exchange-requests/user/${userId}`,
    create: `${API_BASE_BACKEND}/${API_PREFIX}/exchange-requests`,
    getById: (id: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/exchange-requests/${id}`,
    respond: (id: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/exchange-requests/${id}/respond`,
    status: (skillId: string, userId: string) =>
      `${API_BASE_BACKEND}/${API_PREFIX}/exchange-requests/status?skillId=${skillId}&userId=${userId}`,
  },
};
