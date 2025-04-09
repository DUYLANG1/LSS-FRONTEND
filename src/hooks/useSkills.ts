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
  directUserId?: string; // New option for direct user ID in URL
}

export function useSkills(options: UseSkillsOptions = {}) {
  const { initialParams = {}, autoFetch = true, directUserId } = options;

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
        let response;

        // If directUserId is provided, use the direct URL method
        if (directUserId) {
          response = await skillsService.getSkillsByDirectUserId(directUserId);
        }
        // If userId is provided in params, use the getUserSkills method
        else if (paramsToUse.userId) {
          // Extract userId and pass the rest of the params
          const { userId, ...restParams } = paramsToUse;
          response = await skillsService.getUserSkills(userId, restParams);
        } else {
          response = await skillsService.getAll(paramsToUse);
        }

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
    [params, skills.length, directUserId]
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
  }, [params, autoFetch, directUserId, fetchSkills]); // Include directUserId and fetchSkills in dependencies

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
