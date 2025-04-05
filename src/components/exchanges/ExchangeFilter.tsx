"use client";

import { useState } from "react";
import { ExchangeFilters } from "@/hooks/useExchanges";
import { Button } from "@/components/common/Button";

interface ExchangeFilterProps {
  filters: ExchangeFilters;
  onFilterChange: (filters: ExchangeFilters) => void;
  onClearFilters: () => void;
}

export function ExchangeFilter({
  filters,
  onFilterChange,
  onClearFilters,
}: ExchangeFilterProps) {
  const [skillId, setSkillId] = useState<string>(filters.skillId || "");

  // Update status filter
  const handleStatusChange = (status: "pending" | "accepted" | "rejected" | "") => {
    if (status === "") {
      // Remove status filter
      const { status, ...restFilters } = filters;
      onFilterChange(restFilters);
    } else {
      onFilterChange({ ...filters, status });
    }
  };

  // Apply skill filter
  const handleApplySkillFilter = () => {
    if (skillId.trim()) {
      onFilterChange({ ...filters, skillId });
    } else {
      // Remove skill filter if input is empty
      const { skillId, ...restFilters } = filters;
      onFilterChange(restFilters);
    }
  };

  // Clear all filters and reset local state
  const handleClearFilters = () => {
    setSkillId("");
    onClearFilters();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="font-medium mb-3">Filter Exchanges</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status || ""}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="skill-filter" className="block text-sm font-medium mb-1">
            Skill ID
          </label>
          <div className="flex gap-2">
            <input
              id="skill-filter"
              type="text"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              placeholder="Enter skill ID"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button variant="secondary" size="sm" onClick={handleApplySkillFilter}>
              Apply
            </Button>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}