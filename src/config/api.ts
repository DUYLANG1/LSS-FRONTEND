export const API_BASE_URL = "http://localhost:4000";

export const API_ENDPOINTS = {
  auth: {
    signin: `${API_BASE_URL}/auth/signin`,
    signup: `${API_BASE_URL}/auth/signup`,
  },
  skills: {
    list: `${API_BASE_URL}/skills`,
    categories: `${API_BASE_URL}/skills/categories`,
  },
  users: {
    profile: `${API_BASE_URL}/users`,
    ban: (userId: string) => `${API_BASE_URL}/admin/users/${userId}/ban`,
  },
  admin: {
    metrics: `${API_BASE_URL}/admin/metrics`,
    users: `${API_BASE_URL}/admin/users`,
  },
  exchanges: {
    list: `${API_BASE_URL}/exchanges`,
    create: `${API_BASE_URL}/exchanges`,
    update: (id: string) => `${API_BASE_URL}/exchanges/${id}`,
  },
};
