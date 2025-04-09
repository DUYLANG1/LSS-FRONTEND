import { useState, useEffect, useCallback } from "react";
import {
  skillsService,
  SkillsQueryParams,
  Skill,
  SkillsResponse,
} from "@/services/skillsService";

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
  const [meta, setMeta] = useState<SkillsResponse["meta"]>();
  const [totalCount, setTotalCount] = useState(0);

  const fetchSkills = useCallback(
    async (queryParams?: SkillsQueryParams) => {
      try {
        // Only set loading to true if we don't already have skills
        if (!skills.length) {
          setIsLoading(true);
        }
        setError(null);

        const paramsToUse = queryParams || params;
        const response = await skillsService.getAll(paramsToUse);

        // Ensure skills is always an array, even if the API response is unexpected
        setSkills(response?.skills || []);
        setTotalCount(response?.totalCount || 0);
        setMeta(response?.meta);

        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch skills")
        );
        // Make sure skills is an empty array on error
        setSkills([]);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [params, skills.length]
  );

  const updateParams = useCallback((newParams: Partial<SkillsQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when search criteria change
      ...("search" in newParams || "category" in newParams ? { page: 1 } : {}),
    }));
  }, []);

  // Fetch skills when params change or on initial load
  useEffect(() => {
    if (autoFetch) {
      fetchSkills();
    }
  }, [params, autoFetch]); // Changed dependency from fetchSkills to params to prevent infinite fetching

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
