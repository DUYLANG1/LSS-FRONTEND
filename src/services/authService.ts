import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";
import { UserRole } from "@/utils/permissions";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  };
  token?: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.auth.signup, data);
  },

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.auth.signin, data);
  },
};
