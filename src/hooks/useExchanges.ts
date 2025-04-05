import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/config/api";

export interface Exchange {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkillId: string; // Updated to match backend
  requestedSkillId: string; // Updated to match backend
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  isActive: boolean;
  fromUser: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  toUser: {
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
    setFilters(prev => ({ ...prev, ...newFilters }));
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
        queryParams.append('status', filters.status);
      }

      if (filters.skillId) {
        queryParams.append('skillId', filters.skillId);
      }

      // Append query parameters if any exist
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      const response = await fetch(url, {
        credentials: "include", // Use cookies instead of accessToken
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
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check exchange status");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error checking exchange status:", err);
      return null;
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
      const response = await fetch(
        API_ENDPOINTS.exchanges.create,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            toUserId,
            offeredSkillId,
            requestedSkillId
          }),
        }
      );

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
