import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/config/api";

export interface Exchange {
  id: string;
  fromUserId?: string;
  toUserId?: string;
  offeredSkillId?: string; // Skill offered by fromUser
  requestedSkillId?: string; // Skill requested by fromUser
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
  // Backend provides these properties
  offeredSkill?: {
    id: string;
    title: string;
    description?: string;
    category?: {
      id: number;
      name: string;
      description?: string;
    };
  };
  requestedSkill?: {
    id: string;
    title: string;
    description?: string;
    category?: {
      id: number;
      name: string;
      description?: string;
    };
  };
  // These will be populated on the frontend if needed
  fromUserSkill?: {
    id: string;
    title: string;
    description?: string;
    category?: string;
  };
  toUserSkill?: {
    id: string;
    title: string;
    description?: string;
    category?: string;
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

  // Use a ref to track if this is the first render
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    // Always fetch on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchExchanges();
      return;
    }

    // Only fetch when filters change, not on every render
    fetchExchanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filters]);

  // Refresh exchanges data - use a debounced version to prevent multiple rapid calls
  const refreshExchanges = useCallback(() => {
    if (session) {
      fetchExchanges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Update filters and trigger a refetch
  const updateFilters = (newFilters: ExchangeFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Track last fetch time to prevent too frequent API calls
  const lastFetchTime = useRef(0);

  async function fetchExchanges() {
    try {
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }

      // Prevent fetching more than once every 5 seconds
      const now = Date.now();
      if (now - lastFetchTime.current < 5000) {
        console.log("Skipping fetch - too soon since last fetch");
        return;
      }

      lastFetchTime.current = now;
      setLoading(true);

      // Prepare query parameters
      const params: Record<string, string> = {};

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.skillId) {
        params.skillId = filters.skillId;
      }

      // Reduce console logging in production
      if (process.env.NODE_ENV !== "production") {
        console.log("Fetching exchanges for user:", session.user.id);
      }

      // Use the centralized API utility
      const { api } = await import("@/lib/api");
      const data = await api.get(
        API_ENDPOINTS.exchanges.list(session.user.id),
        { params }
      );

      // Only log in development environment
      if (process.env.NODE_ENV !== "production") {
        console.log("Exchanges API response received");
      }

      // Handle different response formats
      let exchangesData: Exchange[] = [];

      if (Array.isArray(data)) {
        // Direct array of exchanges
        exchangesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        // { data: [...exchanges] } format
        exchangesData = data.data;
      } else if (data.exchanges && Array.isArray(data.exchanges)) {
        // { exchanges: [...exchanges] } format
        exchangesData = data.exchanges;
      } else if (data.results && Array.isArray(data.results)) {
        // { results: [...exchanges] } format
        exchangesData = data.results;
      } else {
        // Only log in development environment
        if (process.env.NODE_ENV !== "production") {
          console.warn("Unexpected exchanges API response format");
        }
        exchangesData = [];
      }

      // Process each exchange to ensure it has the required fields
      const processedExchanges = exchangesData.map((exchange) => {
        // Map offeredSkill to fromUserSkill if available
        if (exchange.offeredSkill) {
          exchange.fromUserSkill = {
            id: exchange.offeredSkill.id,
            title: exchange.offeredSkill.title,
            description: exchange.offeredSkill.description,
            category: exchange.offeredSkill.category?.name,
          };
        } else if (!exchange.fromUserSkill && exchange.offeredSkillId) {
          // Fallback if offeredSkill is not available
          exchange.fromUserSkill = {
            id: exchange.offeredSkillId,
            title: "Unknown Skill",
          };
        }

        // Map requestedSkill to toUserSkill if available
        if (exchange.requestedSkill) {
          exchange.toUserSkill = {
            id: exchange.requestedSkill.id,
            title: exchange.requestedSkill.title,
            description: exchange.requestedSkill.description,
            category: exchange.requestedSkill.category?.name,
          };
        } else if (!exchange.toUserSkill && exchange.requestedSkillId) {
          // Fallback if requestedSkill is not available
          exchange.toUserSkill = {
            id: exchange.requestedSkillId,
            title: "Unknown Skill",
          };
        }

        return exchange;
      });

      setExchanges(processedExchanges);
    } catch (err) {
      console.error("Error fetching exchanges:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setExchanges([]); // Reset to empty array on error
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
      // Use the centralized API utility
      const { api } = await import("@/lib/api");
      await api.post(API_ENDPOINTS.exchanges.respond(exchangeId), {
        status: accept ? "accepted" : "rejected",
      });

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
      // Use the centralized API utility
      const { api } = await import("@/lib/api");

      try {
        // Use the centralized API utility with custom options for caching
        const data = await api.get(
          API_ENDPOINTS.exchanges.status(skillId, userId),
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        // Handle different response formats
        // Format 1: { exchange: { ... } }
        // Format 2: { data: { ... } }
        // Format 3: { exists: boolean, status: string }

        if (data.exchange) {
          // Already in the expected format
          // Map offeredSkill/requestedSkill to fromUserSkill/toUserSkill if needed
          if (data.exchange.offeredSkill && !data.exchange.fromUserSkill) {
            data.exchange.fromUserSkill = {
              id: data.exchange.offeredSkill.id,
              title: data.exchange.offeredSkill.title,
              description: data.exchange.offeredSkill.description,
              category: data.exchange.offeredSkill.category?.name,
            };
          }
          if (data.exchange.requestedSkill && !data.exchange.toUserSkill) {
            data.exchange.toUserSkill = {
              id: data.exchange.requestedSkill.id,
              title: data.exchange.requestedSkill.title,
              description: data.exchange.requestedSkill.description,
              category: data.exchange.requestedSkill.category?.name,
            };
          }
          return data;
        } else if (data.data) {
          // Transform from { data: { ... } } to { exchange: { ... } }
          const exchange = data.data;
          // Map offeredSkill/requestedSkill to fromUserSkill/toUserSkill if needed
          if (exchange.offeredSkill && !exchange.fromUserSkill) {
            exchange.fromUserSkill = {
              id: exchange.offeredSkill.id,
              title: exchange.offeredSkill.title,
              description: exchange.offeredSkill.description,
              category: exchange.offeredSkill.category?.name,
            };
          }
          if (exchange.requestedSkill && !exchange.toUserSkill) {
            exchange.toUserSkill = {
              id: exchange.requestedSkill.id,
              title: exchange.requestedSkill.title,
              description: exchange.requestedSkill.description,
              category: exchange.requestedSkill.category?.name,
            };
          }
          return {
            exchange: exchange,
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
      } catch (apiError: any) {
        // If it's a 404, it means there's no exchange yet, which is not an error
        if (apiError.status === 404) {
          console.log(
            "No exchange found for this skill and user (404 response)"
          );
          return {
            exchange: null,
            message: "No exchange exists for this skill and user",
          };
        }

        // Re-throw other errors
        throw apiError;
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
      // Use the centralized API utility
      const { api } = await import("@/lib/api");

      await api.post(API_ENDPOINTS.exchanges.create, {
        toUserId,
        offeredSkillId,
        requestedSkillId,
      });

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
