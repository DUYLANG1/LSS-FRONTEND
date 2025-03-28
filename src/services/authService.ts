import { API_ENDPOINTS } from "@/config/api";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const response = await fetch(API_ENDPOINTS.auth.signup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create account");
    }

    return response.json();
  },
};
