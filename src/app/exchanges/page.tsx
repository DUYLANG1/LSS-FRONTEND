"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/common/Loading";
import { Button } from "@/components/ui/Button";
import { useExchanges, Exchange } from "@/hooks/useExchanges";
import { ExchangeCard } from "@/components/exchanges/ExchangeCard";

export default function ExchangesPage() {
  const { data: session } = useSession();
  const { exchanges, loading, error, respondToExchange, refreshExchanges } =
    useExchanges();

  const [activeTab, setActiveTab] = useState<"all" | "requested" | "received">(
    "all"
  );

  // Add a cooldown for manual refresh to prevent spamming
  const [refreshCooldown, setRefreshCooldown] = useState(false);

  const handleManualRefresh = () => {
    if (!refreshCooldown) {
      refreshExchanges();
      setRefreshCooldown(true);

      // Reset cooldown after 5 seconds
      setTimeout(() => {
        setRefreshCooldown(false);
      }, 5000);
    }
  };

  // Set up periodic refresh of exchanges - but less frequently to reduce API load
  useEffect(() => {
    if (session) {
      // Initial fetch - only if we don't have exchanges already
      if (!exchanges || exchanges.length === 0) {
        refreshExchanges();
      }

      // Set up interval to refresh exchanges every 2 minutes instead of 30 seconds
      // This reduces API calls by 75%
      const intervalId = setInterval(() => {
        refreshExchanges();
      }, 120000); // 2 minutes

      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); // Remove refreshExchanges from dependencies to prevent infinite loops

  // Handle loading and error states
  if (loading && (!exchanges || exchanges.length === 0)) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!session) return <div>Please sign in to view your exchanges</div>;

  // Ensure exchanges is always an array
  const exchangesArray = Array.isArray(exchanges) ? exchanges : [];

  // Filter exchanges based on active tab
  const filteredExchanges = exchangesArray.filter((exchange) => {
    if (activeTab === "requested")
      return exchange.fromUserId === session?.user?.id;
    if (activeTab === "received")
      return exchange.toUserId === session?.user?.id;
    return true; // "all" tab
  });

  // Group exchanges by skill for better organization
  const groupedExchanges: Record<string, Exchange[]> = {};

  if (activeTab === "requested" && filteredExchanges.length > 0) {
    // Group by requested skill
    filteredExchanges.forEach((exchange) => {
      const skillTitle = exchange.toUserSkill?.title || "Unknown Skill";
      if (!groupedExchanges[skillTitle]) {
        groupedExchanges[skillTitle] = [];
      }
      groupedExchanges[skillTitle].push(exchange);
    });
  } else {
    // For other tabs, just put all exchanges in one group
    groupedExchanges["All Exchanges"] = filteredExchanges;
  }

  // Handle exchange response
  const handleAccept = async (id: string) => {
    await respondToExchange(id, true);
    return true;
  };

  const handleReject = async (id: string) => {
    await respondToExchange(id, false);
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Exchanges</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your existing skill exchanges.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleManualRefresh}
          className="flex items-center gap-2 self-end md:self-auto"
          disabled={loading || refreshCooldown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
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
          {loading
            ? "Refreshing..."
            : refreshCooldown
            ? "Wait 5s..."
            : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "requested"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("requested")}
            >
              Requested
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "received"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("received")}
            >
              Received
            </button>
          </div>

          {/* Exchange Cards */}
          <div className="space-y-8">
            {Object.keys(groupedExchanges).length > 0 ? (
              Object.entries(groupedExchanges).map(
                ([skillTitle, exchanges]) => (
                  <div key={skillTitle} className="space-y-4">
                    {activeTab === "requested" && (
                      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400 pb-2 mb-3 inline-block">
                        {skillTitle}
                      </h3>
                    )}

                    {exchanges.map((exchange) => (
                      <ExchangeCard
                        key={exchange.id}
                        exchange={exchange}
                        onAccept={handleAccept}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )
              )
            ) : (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {activeTab === "all"
                    ? "You don't have any exchanges yet."
                    : activeTab === "requested"
                    ? "You haven't requested any skill exchanges yet."
                    : "You haven't received any exchange requests yet."}
                </p>
                <div className="mt-4">
                  <a
                    href="/skills"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Skills to Start Exchanges
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
