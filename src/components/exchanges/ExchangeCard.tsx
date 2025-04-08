"use client";

import { Exchange } from "@/hooks/useExchanges";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ExchangeCardProps {
  exchange: Exchange;
  onAccept?: (id: string) => Promise<boolean>;
  onReject?: (id: string) => Promise<boolean>;
}

export function ExchangeCard({
  exchange,
  onAccept,
  onReject,
}: ExchangeCardProps) {
  const { data: session } = useSession();
  const isRequester = exchange.fromUserId === session?.user?.id;

  // Determine which user is the current user and which is the other user
  const currentUser = isRequester ? exchange.fromUser : exchange.toUser;
  const otherUser = isRequester ? exchange.toUser : exchange.fromUser;

  // Ensure we have user objects even if they're missing from the API
  const safeCurrentUser = currentUser || {
    id: session?.user?.id || "unknown",
    name: isRequester ? "You" : "Other User",
    avatar: "",
  };

  const safeOtherUser = otherUser || {
    id: isRequester
      ? exchange.toUserId || "unknown"
      : session?.user?.id || "unknown",
    name: isRequester ? "Other User" : "You",
    avatar: "",
  };

  // Determine which skills are being offered and requested
  const offeredSkill = isRequester
    ? exchange.fromUserSkill?.title || "Unknown skill"
    : exchange.toUserSkill?.title || "Unknown skill";
  const requestedSkill = isRequester
    ? exchange.toUserSkill?.title || "Unknown skill"
    : exchange.fromUserSkill?.title || "Unknown skill";

  // Get skill IDs for linking
  const offeredSkillId = isRequester
    ? exchange.offeredSkillId
    : exchange.requestedSkillId;
  const requestedSkillId = isRequester
    ? exchange.requestedSkillId
    : exchange.offeredSkillId;

  // Format the date
  const formattedDate = exchange.createdAt
    ? new Date(exchange.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  // Determine if the current user can respond to this exchange
  const canRespond = !isRequester && exchange.status === "pending";

  // Get status color and icon
  const getStatusInfo = () => {
    switch (exchange.status) {
      case "pending":
        return {
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-800 dark:text-yellow-300",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "accepted":
        return {
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-800 dark:text-green-300",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "rejected":
        return {
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-300",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
          ),
        };
      default:
        return {
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          textColor: "text-gray-800 dark:text-gray-300",
          icon: null,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        {/* Header with status and date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}
            >
              {statusInfo.icon}
              {exchange.status.charAt(0).toUpperCase() +
                exchange.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            ID: {exchange.id.substring(0, 8)}
          </span>
        </div>

        {/* Exchange details */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={safeCurrentUser.avatar || "/placeholder-avatar.jpg"}
              alt={`${safeCurrentUser.name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {isRequester ? "You" : safeCurrentUser.name}
              </p>
              <div className="mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {isRequester ? "Offering:" : "Requesting:"}
                </p>
                <Link
                  href={offeredSkillId ? `/skills/${offeredSkillId}` : "#"}
                  className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  {offeredSkill}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center self-center my-2 md:my-0">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <img
              src={safeOtherUser.avatar || "/placeholder-avatar.jpg"}
              alt={`${safeOtherUser.name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {isRequester ? safeOtherUser.name : "You"}
              </p>
              <div className="mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {isRequester ? "Requesting:" : "Offering:"}
                </p>
                <Link
                  href={requestedSkillId ? `/skills/${requestedSkillId}` : "#"}
                  className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  {requestedSkill}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {canRespond && onAccept && onReject && (
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept(exchange.id)}
              className="px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(exchange.id)}
              className="px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
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
              Decline
            </Button>
          </div>
        )}

        {/* Show message for accepted exchanges */}
        {exchange.status === "accepted" && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-green-600 dark:text-green-400 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Contact information is available in your profile. You can now
            arrange the skill exchange!
          </div>
        )}
      </div>
    </div>
  );
}
