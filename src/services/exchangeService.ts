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
   */
  async checkExchangeStatus(
    skillId: string,
    userId: string
  ): Promise<{ exists: boolean; status?: ExchangeStatus }> {
    return api.get(API_ENDPOINTS.exchanges.status(skillId, userId));
  },
};
