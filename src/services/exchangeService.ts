import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

export enum ExchangeStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export interface Exchange {
  id: string;
  requesterId: string;
  providerId: string;
  skillId: string;
  status: ExchangeStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  skill: {
    id: string;
    title: string;
  };
  requester: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
  };
}

export interface CreateExchangeRequest {
  skillId: string;
  providerId: string;
  message?: string;
}

export interface RespondToExchangeRequest {
  status: ExchangeStatus.ACCEPTED | ExchangeStatus.REJECTED;
  message?: string;
}

export const exchangeService = {
  /**
   * Get all exchanges for a user
   */
  async getUserExchanges(userId: string): Promise<Exchange[]> {
    return api.get<Exchange[]>(API_ENDPOINTS.exchanges.list(userId));
  },

  /**
   * Create a new exchange request
   */
  async createExchange(data: CreateExchangeRequest): Promise<Exchange> {
    return api.post<Exchange>(API_ENDPOINTS.exchanges.create, data);
  },

  /**
   * Respond to an exchange request
   */
  async respondToExchange(
    exchangeId: string,
    data: RespondToExchangeRequest
  ): Promise<Exchange> {
    return api.put<Exchange>(API_ENDPOINTS.exchanges.respond(exchangeId), data);
  },

  /**
   * Check if an exchange request exists between a user and a skill
   */
  async checkExchangeStatus(
    skillId: string,
    userId: string
  ): Promise<{ exists: boolean; status?: ExchangeStatus }> {
    return api.get(API_ENDPOINTS.exchanges.status(skillId, userId));
  },
};