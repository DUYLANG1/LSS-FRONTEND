/**
 * Enhanced API client with automatic token handling
 * This is a wrapper around the base API utility that ensures all requests
 * have authentication tokens attached.
 */

import { api as baseApi } from "./api";
import { getSession } from "next-auth/react";

// Types
type RequestOptions = Parameters<typeof baseApi.get>[1];

/**
 * API client with automatic token handling
 * All methods ensure the latest token is attached to every request
 */
export const apiClient = {
  /**
   * Perform a GET request with the latest auth token
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const session = await getSession();
    return baseApi.get<T>(endpoint, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  },

  /**
   * Perform a POST request with the latest auth token
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const session = await getSession();
    return baseApi.post<T>(endpoint, data, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  },

  /**
   * Perform a PUT request with the latest auth token
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const session = await getSession();
    return baseApi.put<T>(endpoint, data, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  },

  /**
   * Perform a PATCH request with the latest auth token
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const session = await getSession();
    return baseApi.patch<T>(endpoint, data, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  },

  /**
   * Perform a DELETE request with the latest auth token
   */
  async delete<T = any>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    const session = await getSession();
    return baseApi.delete<T>(endpoint, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  },
};

/**
 * Helper function to create a request with the latest token
 * This is useful for one-off requests where you don't want to import the full apiClient
 */
export async function createAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Request> {
  const session = await getSession();
  const headers = new Headers(options.headers);

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return new Request(endpoint, {
    ...options,
    headers,
  });
}
