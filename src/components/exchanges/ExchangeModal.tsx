"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/common/Button";
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
  const [userSkills, setUserSkills] = useState<Array<{ id: string; title: string }>>([]);
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
      const response = await fetch(API_ENDPOINTS.users.skills, {
        headers: {
          // Remove the accessToken reference and use cookies instead
          "Content-Type": "application/json",
        },
        credentials: "include", // This will include cookies in the request
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

  async function handleSubmit() {
    if (!selectedSkillId || !session) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.exchanges.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This will include cookies in the request
        body: JSON.stringify({
          fromUserSkillId: selectedSkillId,
          toUserSkillId: requestedSkillId,
          toUserId: skillOwnerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create exchange request");
      }

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
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exchange-modal-title"
    >
      <div className="bg-[var(--card-background)] rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 id="exchange-modal-title" className="text-xl font-bold mb-4">Request Skill Exchange</h2>
        
        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
            Exchange request sent successfully!
          </div>
        ) : (
          <>
            <p className="mb-4">
              You're requesting <span className="font-semibold">{requestedSkillTitle}</span>
            </p>
            
            <ErrorDisplay error={error} />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="skill-select">
                Select a skill to offer in exchange:
              </label>
              <select
                id="skill-select"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
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
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || !selectedSkillId || userSkills.length === 0}
                isLoading={loading}
              >
                Send Request
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
