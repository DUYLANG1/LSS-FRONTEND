"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/common/Loading";
import { Button } from "@/components/ui/Button";
import { useExchanges } from "@/hooks/useExchanges";
import { CreateExchangeForm } from "@/components/exchanges/CreateExchangeForm";
import { ExchangeCard } from "@/components/exchanges/ExchangeCard";
import { ExchangeFilter } from "@/components/exchanges/ExchangeFilter";

export default function ExchangesPage() {
  const { data: session } = useSession();
  const {
    exchanges,
    loading,
    error,
    respondToExchange,
    refreshExchanges,
    filters,
    updateFilters,
    clearFilters,
  } = useExchanges();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "active">(
    "all"
  );

  // Set up periodic refresh of exchanges
  useEffect(() => {
    if (session) {
      // Initial fetch
      refreshExchanges();

      // Set up interval to refresh exchanges every 30 seconds
      const intervalId = setInterval(() => {
        refreshExchanges();
      }, 30000);

      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
  }, [session, refreshExchanges]);

  if (loading && exchanges.length === 0) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!session) return <div>Please sign in to view your exchanges</div>;

  // Filter exchanges based on active tab
  const filteredExchanges = exchanges.filter((exchange) => {
    if (activeTab === "pending") return exchange.status === "pending";
    if (activeTab === "active") return exchange.status === "accepted";
    return true; // "all" tab
  });

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
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skill Exchanges</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your skill exchange requests and offers.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refreshExchanges()}
          className="flex items-center gap-2"
          disabled={loading}
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
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Exchange Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Create Request</h2>
            <CreateExchangeForm />
          </div>

          {/* Filters */}
          <ExchangeFilter
            filters={filters}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Exchanges
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "active"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active
            </button>
          </div>

          {/* Exchange Cards */}
          <div className="space-y-4">
            {filteredExchanges.length > 0 ? (
              filteredExchanges.map((exchange) => (
                <ExchangeCard
                  key={exchange.id}
                  exchange={exchange}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  {activeTab === "all"
                    ? "You don't have any exchanges yet."
                    : activeTab === "pending"
                    ? "You don't have any pending exchanges."
                    : "You don't have any active exchanges."}
                </p>
                {activeTab === "all" && (
                  <a
                    href="/skills"
                    className="text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Browse skills to start an exchange
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
