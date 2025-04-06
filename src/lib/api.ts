import { API_BASE_BACKEND } from "@/config/api";
import { getSession } from "next-auth/react";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
  withCredentials?: boolean;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Enhanced fetch function with error handling and automatic JSON parsing
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    params,
    withCredentials = true,
    headers: customHeaders = {},
    ...customOptions
  } = options;

  // Build URL with query parameters
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${API_BASE_BACKEND}${endpoint}`
  );

  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Get the session to access the token
  const session = await getSession();

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    // Add Authorization header with token if available
    ...(session?.accessToken
      ? {
          Authorization: `Bearer ${session.accessToken}`,
        }
      : {}),
    ...customHeaders,
  };

  // Credentials handling
  const credentials = withCredentials ? "include" : "same-origin";

  try {
    const response = await fetch(url.toString(), {
      ...customOptions,
      headers,
      credentials,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const error = new Error(
        `API error: ${response.status} ${response.statusText}`
      ) as ApiError;

      error.status = response.status;

      // Try to parse error response as JSON
      if (contentType?.includes("application/json")) {
        error.data = await response.json();
      } else {
        error.data = await response.text();
      }

      throw error;
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    // Return text for non-JSON responses
    return (await response.text()) as unknown as T;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }

    // Handle network errors
    const networkError = new Error(
      `Network error: ${(error as Error).message}`
    ) as ApiError;

    throw networkError;
  }
}

/**
 * HTTP request methods with type safety
 */
export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { method: "GET", ...options }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { method: "DELETE", ...options }),
};
