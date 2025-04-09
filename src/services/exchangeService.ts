import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

export enum ExchangeStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
}

export interface Exchange {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  deletedAt: string | null;
  fromUser: User;
  toUser: User;
  offeredSkill: Skill;
  requestedSkill: Skill;
}

export interface CreateExchangeRequest {
  toUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
}

export interface RespondToExchangeRequest {
  status: ExchangeStatus.ACCEPTED | ExchangeStatus.REJECTED;
}

export const exchangeService = {
  /**
   * Get all exchanges for a user (both sent and received)
   */
  async getUserExchanges(userId: string): Promise<Exchange[]> {
    return api.get<Exchange[]>(API_ENDPOINTS.exchanges.list(userId));
  },

  /**
   * Get a specific exchange by ID
   */
  async getExchangeById(id: string): Promise<Exchange> {
    return api.get<Exchange>(API_ENDPOINTS.exchanges.getById(id));
  },

  /**
   * Create a new exchange request
   */
  async createExchange(data: CreateExchangeRequest): Promise<Exchange> {
    return api.post<Exchange>(API_ENDPOINTS.exchanges.create, data);
  },

  /**
   * Respond to an exchange request (accept or reject)
   */
  async respondToExchange(
    exchangeId: string,
    data: RespondToExchangeRequest
  ): Promise<Exchange> {
    return api.put<Exchange>(API_ENDPOINTS.exchanges.respond(exchangeId), data);
  },

  /**
   * Check if an exchange request exists between a user and a skill
   * @param userId The user ID to check exchanges for
   * @param skillId Optional skill ID to filter by
   */
  async checkExchangeStatus(
    userId: string,
    skillId?: string
  ): Promise<{
    data: {
      requests: Exchange[];
      pendingRequests: Exchange[];
      acceptedRequests: Exchange[];
      rejectedRequests: Exchange[];
      counts: {
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
      };
    };
  }> {
    // Get all exchanges for the user
    const response = await api.get(API_ENDPOINTS.exchanges.status(userId));

    // If skillId is provided, filter the results
    if (skillId && response.data && response.data.requests) {
      // Find exchanges related to the specified skill
      const filteredRequests = response.data.requests.filter(
        (req: Exchange) =>
          req.requestedSkillId === skillId || req.offeredSkillId === skillId
      );

      if (filteredRequests.length > 0) {
        // Return only the exchanges related to the skill
        return {
          data: {
            ...response.data,
            requests: filteredRequests,
            // Also filter the status-specific arrays
            pendingRequests: response.data.pendingRequests.filter(
              (req: Exchange) =>
                req.requestedSkillId === skillId ||
                req.offeredSkillId === skillId
            ),
            acceptedRequests: response.data.acceptedRequests.filter(
              (req: Exchange) =>
                req.requestedSkillId === skillId ||
                req.offeredSkillId === skillId
            ),
            rejectedRequests: response.data.rejectedRequests.filter(
              (req: Exchange) =>
                req.requestedSkillId === skillId ||
                req.offeredSkillId === skillId
            ),
          },
        };
      }
    }

    // Return the full response if no skillId provided or no matching exchanges found
    return response;
  },
};
