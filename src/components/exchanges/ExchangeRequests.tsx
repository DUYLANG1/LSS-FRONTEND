"use client";

import { Button } from "@/components/common/Button";

interface ExchangeRequestsProps {
  fromUser: {
    name: string;
    avatar: string;
    offeredSkill: string;
    id?: string;
  };
  toUser: {
    name: string;
    avatar: string;
    requestedSkill: string;
    id?: string;
  };
  status: "pending" | "accepted" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
}

export default function ExchangeRequests({
  fromUser,
  toUser,
  status,
  onAccept,
  onReject,
}: ExchangeRequestsProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={fromUser.avatar}
            alt={`${fromUser.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{fromUser.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Offering: <span className="font-medium">{fromUser.offeredSkill}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
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

        <div className="flex items-center gap-3 flex-1">
          <img
            src={toUser.avatar}
            alt={`${toUser.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{toUser.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Requested: <span className="font-medium">{toUser.requestedSkill}</span>
            </p>
          </div>
        </div>

        {status === "pending" && onAccept && onReject && (
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="success" size="sm" onClick={onAccept}>
              Accept
            </Button>
            <Button variant="danger" size="sm" onClick={onReject}>
              Decline
            </Button>
          </div>
        )}

        {status === "accepted" && (
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
            Accepted
          </div>
        )}

        {status === "rejected" && (
          <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
            Declined
          </div>
        )}
      </div>
    </div>
  );
}