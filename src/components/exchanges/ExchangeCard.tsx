"use client";

import { Exchange } from "@/hooks/useExchanges";
import { Button } from "@/components/common/Button";
import { useSession } from "next-auth/react";

interface ExchangeCardProps {
  exchange: Exchange;
  onAccept?: (id: string) => Promise<boolean>;
  onReject?: (id: string) => Promise<boolean>;
}

export function ExchangeCard({ exchange, onAccept, onReject }: ExchangeCardProps) {
  const { data: session } = useSession();
  const isRequester = exchange.fromUserId === session?.user?.id;
  
  // Determine which user is the current user and which is the other user
  const currentUser = isRequester ? exchange.fromUser : exchange.toUser;
  const otherUser = isRequester ? exchange.toUser : exchange.fromUser;
  
  // Determine which skills are being offered and requested
  const offeredSkill = isRequester 
    ? exchange.fromUserSkill?.title || "Unknown skill" 
    : exchange.toUserSkill?.title || "Unknown skill";
  const requestedSkill = isRequester 
    ? exchange.toUserSkill?.title || "Unknown skill" 
    : exchange.fromUserSkill?.title || "Unknown skill";
  
  // Format the date
  const formattedDate = new Date(exchange.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Determine if the current user can respond to this exchange
  const canRespond = !isRequester && exchange.status === "pending";
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Header with status and date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              exchange.status === "pending" 
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" 
                : exchange.status === "accepted" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}>
              {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ID: {exchange.id.substring(0, 8)}
          </span>
        </div>
        
        {/* Exchange details */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={currentUser.avatar || "/placeholder-avatar.jpg"}
              alt={`${currentUser.name}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{isRequester ? "You" : currentUser.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isRequester ? "Offering" : "Requesting"}: <span className="font-medium">{offeredSkill}</span>
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
              src={otherUser.avatar || "/placeholder-avatar.jpg"}
              alt={`${otherUser.name}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{isRequester ? otherUser.name : "You"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isRequester ? "Requesting" : "Offering"}: <span className="font-medium">{requestedSkill}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        {canRespond && onAccept && onReject && (
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="success" size="sm" onClick={() => onAccept(exchange.id)}>
              Accept
            </Button>
            <Button variant="danger" size="sm" onClick={() => onReject(exchange.id)}>
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}