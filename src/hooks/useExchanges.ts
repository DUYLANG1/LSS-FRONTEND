import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { API_ENDPOINTS } from '@/config/api';

export interface Exchange {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserSkillId: string;
  toUserSkillId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  fromUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  fromUserSkill: {
    id: string;
    title: string;
  };
  toUserSkill: {
    id: string;
    title: string;
  };
}

export function useExchanges() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    async function fetchExchanges() {
      try {
        const response = await fetch(API_ENDPOINTS.exchanges.list, {
          credentials: 'include', // Use cookies instead of accessToken
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exchanges');
        }

        const data = await response.json();
        setExchanges(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExchanges();
  }, [session]);

  const respondToExchange = async (exchangeId: string, accept: boolean) => {
    if (!session) return false;
    
    // Optimistically update UI
    const originalExchanges = [...exchanges];
    setExchanges(exchanges.map(exchange => 
      exchange.id === exchangeId 
        ? { ...exchange, status: accept ? 'accepted' : 'rejected' } 
        : exchange
    ));
    
    try {
      const response = await fetch(API_ENDPOINTS.exchanges.respond(exchangeId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: accept ? 'accepted' : 'rejected' }),
      });

      if (!response.ok) {
        // Revert to original state if request fails
        setExchanges(originalExchanges);
        throw new Error(`Failed to ${accept ? 'accept' : 'reject'} exchange`);
      }
      
      return true;
    } catch (err) {
      // Revert to original state if request fails
      setExchanges(originalExchanges);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return { exchanges, loading, error, respondToExchange };
}