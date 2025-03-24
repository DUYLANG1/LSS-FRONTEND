export const adminService = {
  async getMetrics() {
    const response = await fetch("/api/admin/metrics");
    return response.json();
  },

  async getUsers() {
    const response = await fetch("/api/admin/users");
    return response.json();
  },

  async banUser(userId: string) {
    const response = await fetch(`/api/admin/users/${userId}/ban`, {
      method: "POST",
    });
    return response.json();
  },
};
