"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useExchanges } from "@/hooks/useExchanges";
import { Button } from "@/components/ui/Button";
import { API_ENDPOINTS } from "@/config/api";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

interface CreateExchangeFormProps {
  onSuccess?: () => void;
}

export function CreateExchangeForm({ onSuccess }: CreateExchangeFormProps) {
  const { createExchangeRequest } = useExchanges();
  const { data: session } = useSession();

  const [userSkills, setUserSkills] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [toUserId, setToUserId] = useState<string>("");
  const [requestedSkillId, setRequestedSkillId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // New state for skill search
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string; userId: string; userName: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch user's skills when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserSkills();
    }
  }, [session]);

  async function fetchUserSkills() {
    try {
      setLoading(true);
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Import the API utility to use the centralized fetch with auth
      const { api } = await import("@/lib/api");

      // Use the API utility which will automatically include the auth token
      const response = await api.get(API_ENDPOINTS.users.skills(userId));

      // Ensure we have an array of skills
      let skillsArray = [];

      // Handle different response formats
      if (Array.isArray(response)) {
        skillsArray = response;
      } else if (response && typeof response === "object") {
        // Check for common response patterns
        if (response.data && Array.isArray(response.data)) {
          skillsArray = response.data;
        } else if (response.skills && Array.isArray(response.skills)) {
          skillsArray = response.skills;
        } else if (response.results && Array.isArray(response.results)) {
          skillsArray = response.results;
        }
      }

      console.log("Skills response:", response);
      console.log("Processed skills array:", skillsArray);

      setUserSkills(skillsArray);
      if (skillsArray.length > 0) {
        setSelectedSkillId(skillsArray[0].id);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setUserSkills([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }

  // Search for skills based on query
  async function searchSkills() {
    if (!skillSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      // Import the API utility to use the centralized fetch with auth
      const { api } = await import("@/lib/api");

      // Use the API utility which will automatically include the auth token
      const data = await api.get(`${API_ENDPOINTS.skills.list}`, {
        params: { search: skillSearchQuery },
      });

      // Handle different response formats
      let skillsData = [];
      if (Array.isArray(data)) {
        skillsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        skillsData = data.data;
      } else if (data.skills && Array.isArray(data.skills)) {
        skillsData = data.skills;
      } else if (data.results && Array.isArray(data.results)) {
        skillsData = data.results;
      } else {
        console.warn("Unexpected skill search response format:", data);
        skillsData = [];
      }

      // Filter out the user's own skills
      const filteredResults = skillsData.filter(
        (skill: any) => skill.userId !== session?.user?.id
      );

      // Ensure each skill has the required fields
      const processedResults = filteredResults.map((skill: any) => ({
        id: skill.id,
        title: skill.title || "Unknown Skill",
        userId: skill.userId || "unknown",
        userName: skill.userName || skill.user?.name || "Unknown User",
      }));

      setSearchResults(processedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSearching(false);
    }
  }

  // Handle skill selection from search results
  function selectSkill(skillId: string, userId: string) {
    setRequestedSkillId(skillId);
    setToUserId(userId);
    setSearchResults([]); // Clear search results after selection
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedSkillId || !toUserId || !requestedSkillId) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await createExchangeRequest(
        toUserId,
        selectedSkillId,
        requestedSkillId
      );

      if (success) {
        setSuccess(true);
        // Reset form
        setToUserId("");
        setRequestedSkillId("");
        setSkillSearchQuery("");

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error("Failed to create exchange request");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Exchange request created successfully!
        </div>
      )}

      <ErrorDisplay error={error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Skill Search Section */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Find a Skill to Request
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              placeholder="Search for skills by name..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={searchSkills}
              isLoading={isSearching}
              disabled={isSearching || !skillSearchQuery.trim()}
            >
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((skill) => (
                  <li
                    key={skill.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => selectSkill(skill.id, skill.userId)}
                  >
                    <div className="font-medium">{skill.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      by {skill.userName}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-2">
              <div className="animate-pulse">Searching...</div>
            </div>
          )}

          {!isSearching && skillSearchQuery && searchResults.length === 0 && (
            <div className="text-center py-2 text-gray-500 dark:text-gray-400">
              No skills found. Try a different search term.
            </div>
          )}
        </div>

        {/* Selected Skill Information */}
        {requestedSkillId && toUserId && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">
              Selected Skill
            </h4>
            <p className="text-blue-700 dark:text-blue-400">
              Skill ID: {requestedSkillId.substring(0, 8)}...
            </p>
            <p className="text-blue-700 dark:text-blue-400">
              User ID: {toUserId.substring(0, 8)}...
            </p>
          </div>
        )}

        {/* Hidden fields for form submission */}
        <input type="hidden" id="toUserId" value={toUserId} />
        <input type="hidden" id="requestedSkillId" value={requestedSkillId} />

        {/* Your Skill to Offer */}
        <div>
          <label
            htmlFor="offeredSkillId"
            className="block text-sm font-medium mb-2"
          >
            Your Skill to Offer
          </label>
          {loading && userSkills.length === 0 ? (
            <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ) : (
            <select
              id="offeredSkillId"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading || userSkills.length === 0}
              required
            >
              {userSkills.length === 0 ? (
                <option value="">You don't have any skills to offer</option>
              ) : (
                userSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.title}
                  </option>
                ))
              )}
            </select>
          )}

          {userSkills.length === 0 && !loading && (
            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-400">
                You need to create a skill before you can request an exchange.
              </p>
              <a
                href="/skills/create"
                className="mt-2 inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                Create a Skill
              </a>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full py-3"
          disabled={
            loading || userSkills.length === 0 || !requestedSkillId || !toUserId
          }
          isLoading={loading}
        >
          Create Exchange Request
        </Button>
      </form>
    </div>
  );
}
