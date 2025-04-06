import { useState, useEffect, useCallback } from 'react';
import { skillsService, SkillsQueryParams, Skill, SkillsResponse } from '@/services/skillsService';

interface UseSkillsOptions {
  initialParams?: SkillsQueryParams;
  autoFetch?: boolean;
}

export function useSkills(options: UseSkillsOptions = {}) {
  const { initialParams = {}, autoFetch = true } = options;
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<SkillsQueryParams>(initialParams);
  const [meta, setMeta] = useState<SkillsResponse['meta']>();
  const [totalCount, setTotalCount] = useState(0);

  const fetchSkills = useCallback(async (queryParams?: SkillsQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const paramsToUse = queryParams || params;
      const response = await skillsService.getAll(paramsToUse);
      
      setSkills(response.skills);
      setTotalCount(response.totalCount);
      setMeta(response.meta);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch skills'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const updateParams = useCallback((newParams: Partial<SkillsQueryParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when search criteria change
      ...(('search' in newParams || 'category' in newParams) ? { page: 1 } : {})
    }));
  }, []);

  // Fetch skills when params change or on initial load
  useEffect(() => {
    if (autoFetch) {
      fetchSkills();
    }
  }, [fetchSkills, autoFetch]);

  return {
    skills,
    isLoading,
    error,
    params,
    meta,
    totalCount,
    fetchSkills,
    updateParams,
    setSkills,
  };
}