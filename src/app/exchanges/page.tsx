"use client";

import { useSession } from "next-auth/react";
import ExchangeRequests from "@/components/exchanges/ExchangeRequests";
import { Loading } from "@/components/common/Loading";
import { useExchanges } from "@/hooks/useExchanges";
import CreateExchangeRequest from "@/components/exchanges/CreateExchangeRequest";

export default function ExchangesPage() {
  const { data: session } = useSession();
  const { exchanges, loading, error, respondToExchange } = useExchanges();

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!session) return <div>Please sign in to view your exchanges</div>;

  // Filter exchanges by status
  const pendingExchanges = exchanges.filter((ex) => ex.status === "pending");
  const activeExchanges = exchanges.filter((ex) => ex.status === "accepted");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Skill Exchanges</h1>
      <p className="mb-6">Manage your skill exchange requests and offers.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Create Request</h2>
            <CreateExchangeRequest />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-6">
            {pendingExchanges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                <div className="space-y-4">
                  {pendingExchanges.map((exchange) => (
                    <ExchangeRequests
                      key={exchange.id}
                      fromUser={{
                        name: exchange.fromUser.name,
                        avatar:
                          exchange.fromUser.avatar || "/placeholder-avatar.jpg",
                        offeredSkill:
                          exchange.fromUserSkill?.title || "Unknown skill",
                        id: exchange.fromUser.id,
                      }}
                      toUser={{
                        name: exchange.toUser.name,
                        avatar:
                          exchange.toUser.avatar || "/placeholder-avatar.jpg",
                        requestedSkill:
                          exchange.toUserSkill?.title || "Unknown skill",
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
                  {activeExchanges.map((exchange) => (
                    <ExchangeRequests
                      key={exchange.id}
                      fromUser={{
                        name: exchange.fromUser.name,
                        avatar:
                          exchange.fromUser.avatar || "/placeholder-avatar.jpg",
                        offeredSkill:
                          exchange.fromUserSkill?.title || "Unknown skill",
                      }}
                      toUser={{
                        name: exchange.toUser.name,
                        avatar:
                          exchange.toUser.avatar || "/placeholder-avatar.jpg",
                        requestedSkill:
                          exchange.toUserSkill?.title || "Unknown skill",
                      }}
                      status="accepted"
                    />
                  ))}
                </div>
              </div>
            )}

            {exchanges.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You don't have any exchanges yet.
                </p>
                <a
                  href="/skills"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  Browse skills to start an exchange
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
