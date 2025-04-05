"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExchangeModal } from "@/components/exchanges/ExchangeModal";
import { useExchanges, Exchange } from "@/hooks/useExchanges";
import { Button } from "@/components/common/Button";

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
  const [exchangeId, setExchangeId] = useState<string | null>(null);
  const [exchangeDetails, setExchangeDetails] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const {
    exchanges,
    loading: exchangesLoading,
    checkExchangeStatusForSkill,
  } = useExchanges();

  // Check if there's an existing exchange request for this skill
  useEffect(() => {
    if (session?.user?.id) {
      fetchExchangeStatus();

      // Set up polling for status updates if there's a pending exchange
      let statusCheckInterval: NodeJS.Timeout | null = null;

      if (exchangeStatus === "pending") {
        // Poll every 10 seconds for status updates
        statusCheckInterval = setInterval(() => {
          fetchExchangeStatus();
        }, 10000);
      }

      // Clean up interval on unmount or when status changes
      return () => {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
        }
      };
    }
  }, [session, skillId, exchangeStatus]);

  // Fetch exchange status directly from API
  async function fetchExchangeStatus() {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      // Call the API to get real exchange status from database
      const result = await checkExchangeStatusForSkill(
        skillId,
        session.user.id
      );

      if (result && result.exchange) {
        // Update with the latest status from the ExchangeRequest table
        setExchangeStatus(result.exchange.status);
        setExchangeId(result.exchange.id);
        setExchangeDetails(result.exchange);

        console.log(
          `Exchange status for skill ${skillId}: ${result.exchange.status}`
        );
      } else {
        // Reset states if no exchange found
        setExchangeStatus(null);
        setExchangeId(null);
        setExchangeDetails(null);
      }
    } catch (error) {
      console.error("Error fetching exchange status:", error);
      // Reset states on error
      setExchangeStatus(null);
      setExchangeId(null);
      setExchangeDetails(null);
    } finally {
      setLoading(false);
    }
  }

  // Old local state check function is removed in favor of direct API call

  const handleRequestExchange = () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/skills`);
      return;
    }

    // Don't allow requesting exchange for own skills
    if (session.user?.id === skillOwnerId) {
      return;
    }

    setIsModalOpen(true);
  };

  // Get appropriate button text based on exchange status
  const getButtonText = () => {
    if (exchangesLoading) return "Loading...";

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
        return "primary";
    }
  };

  // Get tooltip text with more details about the exchange
  const getTooltipText = () => {
    if (!exchangeDetails) return "";

    const isRequester = exchangeDetails.fromUserId === session?.user?.id;

    // Safely access the skill titles with optional chaining and fallback values
    const otherSkill = isRequester
      ? exchangeDetails.toUserSkill?.title || "requested skill"
      : exchangeDetails.fromUserSkill?.title || "offered skill";
    const yourSkill = isRequester
      ? exchangeDetails.fromUserSkill?.title || "your skill"
      : exchangeDetails.toUserSkill?.title || "requested skill";

    switch (exchangeStatus) {
      case "pending":
        return `You have a pending exchange request for "${otherSkill}" with your "${yourSkill}"`;
      case "accepted":
        return `Your exchange of "${yourSkill}" for "${otherSkill}" was accepted`;
      case "rejected":
        return `Your exchange request was rejected`;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="relative group">
        <Button
          variant={getButtonVariant()}
          onClick={exchangeStatus ? undefined : handleRequestExchange}
          className={className}
          disabled={
            session?.user?.id === skillOwnerId ||
            exchangesLoading ||
            exchangeStatus === "pending" ||
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
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExchangeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Refresh exchange status after modal is closed
            fetchExchangeStatus();
          }}
          skillOwnerId={skillOwnerId}
          requestedSkillId={skillId}
          requestedSkillTitle={skillTitle}
        />
      )}
    </>
  );
}
