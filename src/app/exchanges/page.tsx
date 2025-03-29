"use client";

import { useSession } from "next-auth/react";
import ExchangeRequest from "@/components/exchanges/ExchangeRequest";
import { LoadingState } from "@/components/common/LoadingState";
import { useExchanges } from "@/hooks/useExchanges";
import { UserAvatar } from "@/components/user/UserAvatar";

export default function ExchangesPage() {
  const { data: session } = useSession();
  const { exchanges, loading, error, respondToExchange } = useExchanges();

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!session) return <div>Please sign in to view your exchanges</div>;

  // Filter exchanges by status
  const pendingExchanges = exchanges.filter(ex => ex.status === "pending");
  const activeExchanges = exchanges.filter(ex => ex.status === "accepted");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Exchanges</h1>

      <div className="space-y-6">
        {pendingExchanges.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
            <div className="space-y-4">
              {pendingExchanges.map(exchange => (
                <ExchangeRequest
                  key={exchange.id}
                  fromUser={{
                    name: exchange.fromUser.name,
                    avatar: exchange.fromUser.avatar || "/placeholder-avatar.jpg",
                    offeredSkill: exchange.fromUserSkill.title,
                    id: exchange.fromUser.id,
                  }}
                  toUser={{
                    name: exchange.toUser.name,
                    avatar: exchange.toUser.avatar || "/placeholder-avatar.jpg",
                    requestedSkill: exchange.toUserSkill.title,
                    id: exchange.toUser.id,
                  }}
                  status="pending"
                  onAccept={() => respondToExchange(exchange.id, true)}
                  onReject={() => respondToExchange(exchange.id, false)}
                />
              ))}
            </div>
          </div>
        )}

        {activeExchanges.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Exchanges</h2>
            <div className="space-y-4">
              {activeExchanges.map(exchange => (
                <ExchangeRequest
                  key={exchange.id}
                  fromUser={{
                    name: exchange.fromUser.name,
                    avatar: exchange.fromUser.avatar || "/placeholder-avatar.jpg",
                    offeredSkill: exchange.fromUserSkill.title,
                  }}
                  toUser={{
                    name: exchange.toUser.name,
                    avatar: exchange.toUser.avatar || "/placeholder-avatar.jpg",
                    requestedSkill: exchange.toUserSkill.title,
                  }}
                  status="accepted"
                />
              ))}
            </div>
          </div>
        )}

        {exchanges.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any exchanges yet.</p>
            <a href="/skills" className="text-blue-500 hover:underline mt-2 inline-block">
              Browse skills to start an exchange
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
