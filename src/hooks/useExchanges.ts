import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS, API_BASE_BACKEND, API_PREFIX } from "@/config/api";

export interface Exchange {
  id: string;
  fromUserId?: string;
  toUserId?: string;
  offeredSkillId?: string; // Skill offered by fromUser
  requestedSkillId?: string; // Skill requested by fromUser
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  deletedAt?: string | null;

  // User information
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

  // Backend skill properties
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

  // Frontend mapped skill properties
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

  // Helper flags for UI
  isFromCurrentUser?: boolean;
  isToCurrentUser?: boolean;
}

export interface ExchangeFilters {
  status?: "pending" | "accepted" | "rejected";
  skillId?: string;
}

// Log API configuration on module load
console.log("API Configuration:", {
  API_BASE_BACKEND,
  API_PREFIX,
  exchangesCreateEndpoint: API_ENDPOINTS.exchanges.create,
});

export function useExchanges() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Track last fetch time to prevent too frequent API calls
  const lastFetchTime = useRef(0);

  // Refresh exchanges data
  const refreshExchanges = useCallback(() => {
    if (session) {
      fetchExchanges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function fetchExchanges() {
    try {
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }

      // Prevent fetching more than once every 5 seconds
      const now = Date.now();
      if (now - lastFetchTime.current < 5000) {
        return;
      }

      lastFetchTime.current = now;
      setLoading(true);

      // Use the centralized API utility
      const { api } = await import("@/lib/api");
      const data = await api.get(API_ENDPOINTS.exchanges.list(session.user.id));

      // Handle different response formats
      let exchangesData: Exchange[] = [];

      if (Array.isArray(data)) {
        exchangesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        exchangesData = data.data;
      } else if (data.exchanges && Array.isArray(data.exchanges)) {
        exchangesData = data.exchanges;
      } else if (data.results && Array.isArray(data.results)) {
        exchangesData = data.results;
      } else {
        exchangesData = [];
      }

      // Process each exchange to ensure it has the required fields
      const processedExchanges = exchangesData.map((exchange) => {
        // Cast to the Exchange interface defined in this file to add frontend properties
        const processedExchange = { ...exchange } as Exchange;

        // Map offeredSkill to fromUserSkill if available
        if (processedExchange.offeredSkill) {
          processedExchange.fromUserSkill = {
            id: processedExchange.offeredSkill.id,
            title: processedExchange.offeredSkill.title,
            description: processedExchange.offeredSkill.description,
            category: processedExchange.offeredSkill.category?.name,
          };
        } else if (
          !processedExchange.fromUserSkill &&
          processedExchange.offeredSkillId
        ) {
          // Fallback if offeredSkill is not available
          processedExchange.fromUserSkill = {
            id: processedExchange.offeredSkillId,
            title: "Unknown Skill",
          };
        }

        // Map requestedSkill to toUserSkill if available
        if (processedExchange.requestedSkill) {
          processedExchange.toUserSkill = {
            id: processedExchange.requestedSkill.id,
            title: processedExchange.requestedSkill.title,
            description: processedExchange.requestedSkill.description,
            category: processedExchange.requestedSkill.category?.name,
          };
        } else if (
          !processedExchange.toUserSkill &&
          processedExchange.requestedSkillId
        ) {
          // Fallback if requestedSkill is not available
          processedExchange.toUserSkill = {
            id: processedExchange.requestedSkillId,
            title: "Unknown Skill",
          };
        }

        return processedExchange;
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
    if (!session) {
      console.error("Cannot check exchange status: No user session");
      return null;
    }

    try {
      console.log("Checking exchange status for:", {
        skillId,
        userId,
        endpoint: API_ENDPOINTS.exchanges.status(userId),
      });

      try {
        // Import the exchange service to use the updated method
        const { exchangeService } = await import("@/services/exchangeService");

        // Use the service with custom options for caching
        console.log(
          "Making API request to:",
          API_ENDPOINTS.exchanges.status(userId)
        );

        // Call the service method with userId and skillId
        const response = await exchangeService.checkExchangeStatus(
          userId,
          skillId
        );
        console.log("Exchange status API response:", response);

        // Process the response to extract the relevant exchange
        if (response.data && response.data.requests) {
          // Find the first relevant exchange (if any)
          const relevantExchange = response.data.requests.find(
            (req) =>
              req.requestedSkillId === skillId || req.offeredSkillId === skillId
          );

          if (relevantExchange) {
            // Process the exchange to ensure it has the required fields
            // Cast to the Exchange interface defined in this file to add frontend properties
            const processedExchange = { ...relevantExchange } as Exchange;

            // Map offeredSkill to fromUserSkill if available
            if (
              processedExchange.offeredSkill &&
              !processedExchange.fromUserSkill
            ) {
              processedExchange.fromUserSkill = {
                id: processedExchange.offeredSkill.id,
                title: processedExchange.offeredSkill.title,
                description: processedExchange.offeredSkill.description,
                category: processedExchange.offeredSkill.category?.name,
              };
            } else if (
              !processedExchange.fromUserSkill &&
              processedExchange.offeredSkillId
            ) {
              // Fallback if offeredSkill is not available
              processedExchange.fromUserSkill = {
                id: processedExchange.offeredSkillId,
                title: "Unknown Skill",
              };
            }

            // Map requestedSkill to toUserSkill if available
            if (
              processedExchange.requestedSkill &&
              !processedExchange.toUserSkill
            ) {
              processedExchange.toUserSkill = {
                id: processedExchange.requestedSkill.id,
                title: processedExchange.requestedSkill.title,
                description: processedExchange.requestedSkill.description,
                category: processedExchange.requestedSkill.category?.name,
              };
            } else if (
              !processedExchange.toUserSkill &&
              processedExchange.requestedSkillId
            ) {
              // Fallback if requestedSkill is not available
              processedExchange.toUserSkill = {
                id: processedExchange.requestedSkillId,
                title: "Unknown Skill",
              };
            }

            // Add isFromCurrentUser and isToCurrentUser flags if not present
            if (processedExchange.isFromCurrentUser === undefined) {
              processedExchange.isFromCurrentUser =
                processedExchange.fromUserId === session?.user?.id;
            }
            if (processedExchange.isToCurrentUser === undefined) {
              processedExchange.isToCurrentUser =
                processedExchange.toUserId === session?.user?.id;
            }

            return {
              exchange: processedExchange,
            };
          }

          // If no exchange found, return null
          return {
            exchange: null,
            message: "No exchange exists for this skill and user",
          };
        } else if ("exchange" in response) {
          // Handle legacy format: { exchange: { ... } }
          return response as any; // Type assertion to handle legacy format
        } else {
          // No relevant exchange found
          return {
            exchange: null,
            message: "No exchange exists for this skill and user",
          };
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
    if (!session?.user?.id) {
      console.error("Cannot create exchange request: No user session");
      return false;
    }

    try {
      console.log("Creating exchange request with params:", {
        toUserId,
        offeredSkillId,
        requestedSkillId,
        currentUserId: session.user.id,
        endpoint: API_ENDPOINTS.exchanges.create,
      });

      // Try using direct fetch for more control
      const currentSession = await import("next-auth/react").then((mod) =>
        mod.getSession()
      );

      console.log("Session for exchange request:", {
        hasSession: !!currentSession,
        hasToken: !!currentSession?.accessToken,
        userId: currentSession?.user?.id,
      });

      // Make the request with detailed logging
      // Log the full URL for debugging
      console.log("Full API URL:", API_ENDPOINTS.exchanges.create);
      console.log("API base:", API_BASE_BACKEND);
      console.log("API prefix:", API_PREFIX);

      try {
        // First try to ping the backend to see if it's reachable
        try {
          const pingResponse = await fetch(`${API_BASE_BACKEND}/health`, {
            method: "GET",
          });
          console.log(
            "Backend health check response:",
            pingResponse.status,
            await pingResponse.text()
          );
        } catch (pingError) {
          console.warn("Backend health check failed:", pingError);
        }

        const response = await fetch(API_ENDPOINTS.exchanges.create, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(currentSession?.accessToken
              ? {
                  Authorization: `Bearer ${currentSession.accessToken}`,
                }
              : {}),
          },
          body: JSON.stringify({
            toUserId,
            offeredSkillId,
            requestedSkillId,
          }),
        });

        console.log("Exchange request response status:", response.status);

        // Check if the response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Exchange request failed: ${response.status} - ${errorText}`
          );
          throw new Error(
            `Failed to create exchange request: ${response.status} ${response.statusText}`
          );
        }

        // Parse the response
        const data = await response.json();
        console.log("Exchange request created successfully:", data);

        // Refresh the exchanges list after creating a new one
        refreshExchanges();
        return true;
      } catch (fetchError) {
        console.error("Fetch error creating exchange request:", fetchError);
        throw fetchError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  return {
    exchanges,
    loading,
    error,
    respondToExchange,
    refreshExchanges,
    checkExchangeStatusForSkill,
    createExchangeRequest,
  };
}
