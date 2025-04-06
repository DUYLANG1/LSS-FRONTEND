"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useExchanges } from "@/hooks/useExchanges";
import { Button } from "@/components/ui/Button";
import { API_ENDPOINTS } from "@/config/api";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

export function CreateExchangeForm() {
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

      const response = await fetch(API_ENDPOINTS.users.skills(userId), {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch your skills");
      }

      const data = await response.json();
      setUserSkills(data);
      if (data.length > 0) {
        setSelectedSkillId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="toUserId" className="block text-sm font-medium mb-1">
            User ID to Exchange With
          </label>
          <input
            id="toUserId"
            type="text"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="requestedSkillId"
            className="block text-sm font-medium mb-1"
          >
            Skill ID You're Requesting
          </label>
          <input
            id="requestedSkillId"
            type="text"
            value={requestedSkillId}
            onChange={(e) => setRequestedSkillId(e.target.value)}
            placeholder="Enter skill ID you want"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="offeredSkillId"
            className="block text-sm font-medium mb-1"
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
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              You need to create a skill before you can request an exchange.{" "}
              <a
                href="/skills/create"
                className="underline font-medium text-orange-600 dark:text-orange-400"
              >
                Create a skill
              </a>
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={loading || userSkills.length === 0}
          isLoading={loading}
        >
          Create Exchange Request
        </Button>
      </form>
    </div>
  );
}
