"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/Button";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillOwnerId: string;
  requestedSkillId: string;
  requestedSkillTitle: string;
}

export function ExchangeModal({
  isOpen,
  onClose,
  skillOwnerId,
  requestedSkillId,
  requestedSkillTitle,
}: ExchangeModalProps) {
  const [userSkills, setUserSkills] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      if (session) {
        fetchUserSkills();
      }
    }
  }, [isOpen, session]);

  async function fetchUserSkills() {
    try {
      setLoading(true);
      // Use the current user's ID from the session
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

  async function handleSubmit() {
    if (!selectedSkillId || !session) return;

    try {
      setLoading(true);
      setError(null);

      // Import the API utility to use the centralized fetch with auth
      const { api } = await import("@/lib/api");

      // Use the API utility which will automatically include the auth token
      await api.post(API_ENDPOINTS.exchanges.create, {
        offeredSkillId: selectedSkillId,
        requestedSkillId: requestedSkillId,
        toUserId: skillOwnerId,
        fromUserId: session.user.id,
      });

      setSuccess(true);
      // Close modal after showing success message briefly
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exchange-modal-title"
    >
      <div className="bg-[var(--card-background)] rounded-lg shadow-xl p-6 max-w-md w-full border border-[var(--card-border)] transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <h2 id="exchange-modal-title" className="text-xl font-bold">
            Request Skill Exchange
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {success ? (
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
            Exchange request sent successfully!
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300">
                You're requesting{" "}
                <span className="font-semibold">"{requestedSkillTitle}"</span>
              </p>
            </div>

            <ErrorDisplay error={error} />

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="skill-select"
              >
                Select a skill to offer in exchange:
              </label>
              {loading && userSkills.length === 0 ? (
                <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ) : (
                <select
                  id="skill-select"
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full p-3 border border-[var(--card-border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loading || userSkills.length === 0}
                >
                  {userSkills.length === 0 ? (
                    <option>You don't have any skills to offer</option>
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/skills/create";
                    }}
                    className="underline font-medium text-orange-600 dark:text-orange-400"
                  >
                    Create a skill
                  </button>
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={
                  loading || !selectedSkillId || userSkills.length === 0
                }
              >
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
