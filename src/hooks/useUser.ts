import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { userService, UserProfile, UpdateProfileData } from '@/services/userService';

export function useUser(userId?: string) {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use the session user ID if no userId is provided
  const targetUserId = userId || session?.user?.id;

  const fetchUser = useCallback(async () => {
    if (!targetUserId) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await userService.getProfile(targetUserId);
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  const updateUser = useCallback(async (data: UpdateProfileData) => {
    if (!targetUserId) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateProfile(targetUserId, data);
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user profile'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  // Fetch user data on initial load
  useEffect(() => {
    if (targetUserId) {
      fetchUser();
    }
  }, [fetchUser, targetUserId]);

  return {
    user,
    isLoading,
    error,
    fetchUser,
    updateUser,
    isCurrentUser: session?.user?.id === targetUserId,
  };
}