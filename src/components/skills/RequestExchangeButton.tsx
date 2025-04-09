"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExchangeModal } from "@/components/exchanges/ExchangeModal";
import { useExchanges, Exchange } from "@/hooks/useExchanges";
import { Button } from "@/components/ui/Button";
import { ToastContext } from "@/components/providers/ToastProvider";
import { useContext } from "react";

interface RequestExchangeButtonProps {
  skillId: string;
  skillTitle: string;
  skillOwnerId: string;
  className?: string;
}

type ExchangeStatus = "pending" | "accepted" | "rejected" | null;

export function RequestExchangeButton({
  skillId,
  skillTitle,
  skillOwnerId,
  className = "",
}: RequestExchangeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState<ExchangeStatus>(null);
  const [exchangeDetails, setExchangeDetails] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { checkExchangeStatusForSkill, createExchangeRequest } = useExchanges();
  const toast = useContext(ToastContext);

  // Check if there's an existing exchange request for this skill and fetch user skills
  useEffect(() => {
    // Track if the component is mounted to prevent state updates after unmounting
    let isMounted = true;

    const initialFetch = async () => {
      if (session?.user?.id) {
        // Fetch exchange status for this skill only once when component mounts
        // or when session/skillId changes
        if (isMounted) await fetchExchangeStatus();

        // Fetch user skills in the background
        if (isMounted) await fetchUserSkills();
      }
    };

    initialFetch();

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, skillId]); // Only depend on session user ID and skillId, not exchangeStatus

  // Track last fetch time to prevent too frequent API calls
  const lastFetchTime = useRef(0);

  // Fetch exchange status directly from API
  async function fetchExchangeStatus() {
    if (!session?.user?.id) {
      console.error("Cannot fetch exchange status: No user session");
      return;
    }

    // Prevent fetching more than once every 10 seconds unless explicitly requested
    const now = Date.now();
    if (
      now - lastFetchTime.current < 10000 &&
      loading &&
      lastFetchTime.current !== 0
    ) {
      console.log("Skipping fetchExchangeStatus due to throttling", {
        timeSinceLastFetch: now - lastFetchTime.current,
        loading,
        lastFetchTime: lastFetchTime.current,
      });
      return;
    }

    console.log("Fetching exchange status for:", {
      skillId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    lastFetchTime.current = now;
    setLoading(true);

    try {
      // Call the API to get real exchange status from database
      console.log("Calling checkExchangeStatusForSkill with params:", {
        skillId,
        userId: session.user.id,
      });

      const result = await checkExchangeStatusForSkill(
        skillId,
        session.user.id
      );

      console.log("Exchange status result:", result);

      if (result && result.exchange) {
        // Update with the latest status from the ExchangeRequest table
        setExchangeStatus(result.exchange.status);
        setExchangeDetails(result.exchange);
      } else {
        // Reset states if no exchange found
        setExchangeStatus(null);
        setExchangeDetails(null);

        // Log message if provided
        if (result && result.message) {
          console.log(result.message);
        }
      }
    } catch (error) {
      console.error("Error fetching exchange status:", error);
      // Reset states on error
      setExchangeStatus(null);
      setExchangeDetails(null);
    } finally {
      setLoading(false);
    }
  }

  // Old local state check function is removed in favor of direct API call

  const [userSkills, setUserSkills] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [fetchingSkills, setFetchingSkills] = useState(false);

  // Fetch user skills when needed
  const fetchUserSkills = async () => {
    if (!session?.user?.id) return [];

    try {
      setFetchingSkills(true);
      // Import the API utility to use the centralized fetch with auth
      const { api } = await import("@/lib/api");

      // Use the API utility which will automatically include the auth token
      const response = await api.get(`/api/v1/users/skills/${session.user.id}`);

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

      setUserSkills(skillsArray);
      return skillsArray;
    } catch (error) {
      console.error("Error fetching user skills:", error);
      return [];
    } finally {
      setFetchingSkills(false);
    }
  };

  const handleRequestExchange = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/skills`);
      return;
    }

    // Don't allow requesting exchange for own skills
    if (session.user?.id === skillOwnerId) {
      return;
    }

    // Fetch user skills if we don't have them yet
    if (userSkills.length === 0 && !fetchingSkills) {
      const skills = await fetchUserSkills();

      // If user has no skills, open modal to show the message
      if (skills.length === 0) {
        setIsModalOpen(true);
        return;
      }

      // If user has exactly one skill, create exchange request directly
      if (skills.length === 1) {
        await handleDirectExchange(skills[0].id);
        return;
      }
    } else if (userSkills.length === 1) {
      // If we already know user has exactly one skill, create exchange request directly
      await handleDirectExchange(userSkills[0].id);
      return;
    }

    // Open modal for user to select which skill to offer
    setIsModalOpen(true);
  };

  // Handle direct exchange request when user has only one skill
  const handleDirectExchange = async (offeredSkillId: string) => {
    if (!session?.user?.id) {
      console.error("Cannot create exchange: No user session");
      return;
    }

    console.log("Starting direct exchange with:", {
      skillOwnerId,
      offeredSkillId,
      skillId,
      currentUserId: session.user.id,
    });

    setLoading(true);
    try {
      // Make sure we're passing the parameters in the correct order:
      // toUserId, offeredSkillId, requestedSkillId
      console.log("Calling createExchangeRequest with params:", {
        toUserId: skillOwnerId,
        offeredSkillId,
        requestedSkillId: skillId,
      });

      const success = await createExchangeRequest(
        skillOwnerId,
        offeredSkillId,
        skillId
      );

      console.log("createExchangeRequest result:", success);

      if (success) {
        console.log("Exchange request created successfully");
        // Immediately update the UI to show pending status
        // This gives instant feedback to the user
        setExchangeStatus("pending");

        // Create a minimal exchange details object for the UI
        const tempExchangeDetails: Exchange = {
          id: `temp-${Date.now()}`, // Temporary ID until we fetch the real one
          status: "pending" as "pending", // Explicitly type as literal
          fromUserId: session.user.id,
          toUserId: skillOwnerId,
          fromUserSkill: {
            id: offeredSkillId,
            title:
              userSkills.find((skill) => skill.id === offeredSkillId)?.title ||
              "Your skill",
          },
          toUserSkill: {
            id: skillId,
            title: skillTitle,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("Setting temporary exchange details:", tempExchangeDetails);
        setExchangeDetails(tempExchangeDetails);

        // Reset the last fetch time to force a refresh regardless of time elapsed
        lastFetchTime.current = 0;
        console.log("Reset lastFetchTime to force refresh");

        try {
          // Fetch the actual exchange status from the server to get the real exchange ID
          console.log("Fetching actual exchange status from server");
          await fetchExchangeStatus();
          console.log("Fetch completed successfully");
        } catch (fetchError) {
          console.error(
            "Error fetching exchange status after creation:",
            fetchError
          );
        }

        // Show success toast notification regardless of fetch status
        if (toast) {
          toast.success(
            "Exchange request sent successfully! Redirecting to exchanges page..."
          );
        }

        // Redirect to exchanges page
        console.log("Redirecting to exchanges page");
        setTimeout(() => {
          router.push("/exchanges");
        }, 2000); // Give user time to see the toast and the status change
      }
    } catch (error) {
      console.error("Error creating exchange request:", error);

      // Log detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Show error toast notification
      if (toast) {
        toast.error("Failed to send exchange request. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log("Exchange request process completed, loading set to false");
    }
  };

  // Get appropriate button text based on exchange status
  const getButtonText = () => {
    if (loading) return "Loading...";

    switch (exchangeStatus) {
      case "pending":
        return "Exchange Pending";
      case "accepted":
        return "Exchange Accepted";
      case "rejected":
        return "Exchange Rejected";
      default:
        return "Request Exchange";
    }
  };

  // Get appropriate button variant based on exchange status
  const getButtonVariant = () => {
    switch (exchangeStatus) {
      case "pending":
        return "secondary";
      case "accepted":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  // Get tooltip text with more details about the exchange
  const getTooltipText = () => {
    if (!exchangeDetails) return "";

    // Use isFromCurrentUser flag if available, otherwise fall back to comparing IDs
    const isRequester =
      exchangeDetails.isFromCurrentUser !== undefined
        ? exchangeDetails.isFromCurrentUser
        : exchangeDetails.fromUserId === session?.user?.id;

    // Safely access the skill titles with optional chaining and fallback values
    // Use the current skill title as a fallback if we don't have the exchange details
    const otherSkill = isRequester
      ? exchangeDetails.toUserSkill?.title || "requested skill"
      : exchangeDetails.fromUserSkill?.title || "offered skill";
    const yourSkill = isRequester
      ? exchangeDetails.fromUserSkill?.title || "your skill"
      : exchangeDetails.toUserSkill?.title || skillTitle || "requested skill";

    switch (exchangeStatus) {
      case "pending":
        if (isRequester) {
          return `You have sent a pending exchange request offering "${yourSkill}" for "${otherSkill}"`;
        } else {
          return `You have received a pending exchange request offering "${otherSkill}" for your "${yourSkill}"`;
        }
      case "accepted":
        return `Your exchange of "${yourSkill}" for "${otherSkill}" was accepted`;
      case "rejected":
        return `Your exchange request was rejected`;
      default:
        return "";
    }
  };

  // Function to manually refresh the exchange status
  const handleRefreshStatus = () => {
    if (!loading) {
      // Reset the last fetch time to force a refresh regardless of time elapsed
      lastFetchTime.current = 0;
      fetchExchangeStatus();
    }
  };

  return (
    <>
      <div className="relative group">
        {exchangeStatus === "pending" && (
          <button
            onClick={handleRefreshStatus}
            className="absolute -top-2 -right-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors z-10"
            title="Refresh status"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
        <Button
          variant={getButtonVariant()}
          onClick={
            exchangeStatus
              ? exchangeStatus === "pending"
                ? handleRefreshStatus
                : undefined
              : handleRequestExchange
          }
          className={className}
          disabled={
            session?.user?.id === skillOwnerId ||
            loading ||
            exchangeStatus === "accepted"
          }
          size="sm"
        >
          {getButtonText()}
        </Button>

        {/* Tooltip for exchange status */}
        {exchangeStatus && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
            {getTooltipText()}
            {exchangeStatus === "pending" && (
              <div className="mt-1 text-xs text-gray-300">
                Click to check for updates
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExchangeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);

            // Reset the last fetch time to force a refresh regardless of time elapsed
            lastFetchTime.current = 0;

            // Fetch the actual exchange status from the server
            // This ensures we have the correct data from the backend
            // and will update the UI accordingly
            fetchExchangeStatus();

            // Also refresh user skills in case they've changed
            fetchUserSkills();
          }}
          skillOwnerId={skillOwnerId}
          requestedSkillId={skillId}
          requestedSkillTitle={skillTitle}
        />
      )}
    </>
  );
}
