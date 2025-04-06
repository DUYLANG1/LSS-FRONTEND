import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/config/api";

export interface Exchange {
  id: string;
  fromUserId?: string;
  toUserId?: string;
  offeredSkillId?: string; // Updated to match backend
  requestedSkillId?: string; // Updated to match backend
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
  isActive?: boolean;
  fromUser?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  toUser?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  // These will be populated on the frontend if needed
  fromUserSkill?: {
    id: string;
    title: string;
  };
  toUserSkill?: {
    id: string;
    title: string;
  };
}

export interface ExchangeFilters {
  status?: "pending" | "accepted" | "rejected";
  skillId?: string;
}

export function useExchanges() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExchangeFilters>({});
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    fetchExchanges();
  }, [session, filters]);

  // Refresh exchanges data
  const refreshExchanges = () => {
    if (session) {
      fetchExchanges();
    }
  };

  // Update filters and trigger a refetch
  const updateFilters = (newFilters: ExchangeFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  async function fetchExchanges() {
    try {
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }

      setLoading(true);

      // Build the URL with query parameters
      let url = API_ENDPOINTS.exchanges.list(session.user.id);
      const queryParams = new URLSearchParams();

      if (filters.status) {
        queryParams.append("status", filters.status);
      }

      if (filters.skillId) {
        queryParams.append("skillId", filters.skillId);
      }

      // Append query parameters if any exist
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          ...(session.accessToken
            ? {
                Authorization: `Bearer ${session.accessToken}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exchanges");
      }

      const data = await response.json();
      setExchanges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const respondToExchange = async (exchangeId: string, accept: boolean) => {
    if (!session) return false;

    // Optimistically update UI
    const originalExchanges = [...exchanges];
    setExchanges(
      exchanges.map((exchange) =>
        exchange.id === exchangeId
          ? { ...exchange, status: accept ? "accepted" : "rejected" }
          : exchange
      )
    );

    try {
      const response = await fetch(
        API_ENDPOINTS.exchanges.respond(exchangeId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session.accessToken
              ? {
                  Authorization: `Bearer ${session.accessToken}`,
                }
              : {}),
          },
          credentials: "include",
          body: JSON.stringify({ status: accept ? "accepted" : "rejected" }),
        }
      );

      if (!response.ok) {
        // Revert to original state if request fails
        setExchanges(originalExchanges);
        throw new Error(`Failed to ${accept ? "accept" : "reject"} exchange`);
      }

      return true;
    } catch (err) {
      // Revert to original state if request fails
      setExchanges(originalExchanges);
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  // Check exchange status for a specific skill
  const checkExchangeStatusForSkill = async (
    skillId: string,
    userId: string
  ) => {
    if (!session) return null;

    try {
      const response = await fetch(
        API_ENDPOINTS.exchanges.status(skillId, userId),
        {
          credentials: "include",
          // Add cache: 'no-store' to ensure we always get the latest data
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            ...(session.accessToken
              ? {
                  Authorization: `Bearer ${session.accessToken}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `Status: ${response.status}`;
        let errorData = null;

        try {
          // Try to parse the error response as JSON
          const errorText = await response.text();
          console.error(
            `Exchange status API error: ${response.status} - ${errorText}`
          );

          try {
            // Attempt to parse as JSON if it looks like JSON
            if (errorText.trim().startsWith("{")) {
              errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorMessage;
            }
          } catch (parseError) {
            // If JSON parsing fails, use the raw text
            console.warn("Failed to parse error response as JSON:", parseError);
          }
        } catch (textError) {
          console.warn("Failed to read error response text:", textError);
        }

        // If it's a 404, it means there's no exchange yet, which is not an error
        if (response.status === 404) {
          console.log(
            "No exchange found for this skill and user (404 response)"
          );
          return {
            exchange: null,
            message: "No exchange exists for this skill and user",
          };
        }

        throw new Error(`Failed to check exchange status: ${errorMessage}`);
      }

      const data = await response.json();

      // Handle different response formats
      // Format 1: { exchange: { ... } }
      // Format 2: { data: { ... } }
      // Format 3: { exists: boolean, status: string }

      if (data.exchange) {
        // Already in the expected format
        return data;
      } else if (data.data) {
        // Transform from { data: { ... } } to { exchange: { ... } }
        return {
          exchange: data.data,
        };
      } else if (data.exists !== undefined) {
        // Transform from { exists: boolean, status: string } to { exchange: { ... } }
        if (data.exists && data.status) {
          return {
            exchange: {
              id: data.id || "unknown",
              status: data.status.toLowerCase(),
              fromUserId: userId,
              toUserId: "unknown",
              // Add minimal required fields
              fromUserSkill: { id: "unknown", title: "Your skill" },
              toUserSkill: { id: skillId, title: "Requested skill" },
            },
          };
        } else {
          return { exchange: null };
        }
      } else {
        // Unknown format, return as is and let the component handle it
        console.warn("Unexpected exchange status response format:", data);
        return data;
      }
    } catch (err) {
      console.error("Error checking exchange status:", err);
      // Return a structured null response instead of just null
      return {
        exchange: null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  };

  // Create a new exchange request
  const createExchangeRequest = async (
    toUserId: string,
    offeredSkillId: string,
    requestedSkillId: string
  ) => {
    if (!session) return false;

    try {
      const response = await fetch(API_ENDPOINTS.exchanges.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session.accessToken
            ? {
                Authorization: `Bearer ${session.accessToken}`,
              }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          toUserId,
          offeredSkillId,
          requestedSkillId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create exchange request");
      }

      // Refresh the exchanges list after creating a new one
      refreshExchanges();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  return {
    exchanges,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    respondToExchange,
    refreshExchanges,
    checkExchangeStatusForSkill,
    createExchangeRequest,
  };
}
