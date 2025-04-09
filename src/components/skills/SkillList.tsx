"use client";

import React from "react";
import { useSkills } from "@/hooks/useSkills";
import SkillCard from "./SkillCard";
import { useRouter, useSearchParams } from "next/navigation";

export interface SkillListProps {
  searchQuery?: string;
  category?: string | null;
  userId?: string;
  limit?: number;
  showPagination?: boolean;
  showActions?: boolean;
}

export function SkillList({
  searchQuery = "",
  category,
  userId,
  limit = 9,
  showPagination = true,
  showActions = true,
}: SkillListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const {
    skills,
    isLoading,
    error,
    meta,
    totalCount,
    updateParams,
    fetchSkills,
  } = useSkills({
    initialParams: {
      page: initialPage,
      limit,
      search: searchQuery,
      category: category || undefined,
      userId,
    },
  });

  // Update search parameters when props change
  React.useEffect(() => {
    updateParams({
      search: searchQuery,
      category: category || undefined,
    });
  }, [searchQuery, category, updateParams]);

  // Determine if pagination is needed based on total pages from meta
  const shouldShowPagination = showPagination && (meta?.totalPages || 0) > 1;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Don't allow invalid page numbers
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    // Update the params for the API call
    updateParams({ page: newPage });

    // Update URL with new page parameter while preserving other query params
    if (shouldShowPagination) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());

      // Get the current path without the query string
      const pathname = window.location.pathname;

      // Push the new URL with updated query params
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Ensure skills is always an array
  const safeSkills = Array.isArray(skills) ? skills : [];

  // Loading skeleton
  if (isLoading && (!safeSkills || safeSkills.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit > 6 ? 6 : limit }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-[var(--card-background)] rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-[var(--error-text)]">{error.message}</p>
        <button
          className="mt-4 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] h-10 px-4 py-2 rounded-md"
          onClick={() => fetchSkills()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!safeSkills || safeSkills.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">No skills found</h3>
        <p className="text-[var(--text-secondary)]">
          {searchQuery || category || userId
            ? "Try adjusting your search or filter criteria."
            : "Be the first to add a skill!"}
        </p>
      </div>
    );
  }

  // Get total pages from meta, with fallback calculation
  const totalPages =
    meta?.totalPages || Math.max(1, Math.ceil(totalCount / limit));

  // Get current page from meta or URL
  const currentPage = meta?.page || initialPage;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} showActions={showActions} />
        ))}
      </div>

      {/* Loading indicator - only show when initially loading */}
      {isLoading && safeSkills.length === 0 && (
        <div className="fixed bottom-4 right-4 bg-[var(--primary)] text-white px-4 py-2 rounded-full shadow-lg transition-opacity duration-300">
          Loading...
        </div>
      )}

      {/* Pagination controls */}
      {shouldShowPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              className="h-8 px-3 text-xs border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)] rounded-md disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;

              // Only show a window of 5 pages
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={`h-8 px-3 text-xs rounded-md ${
                      pageNumber === currentPage
                        ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                        : "border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return <span key={pageNumber}>...</span>;
              }

              return null;
            })}

            <button
              className="h-8 px-3 text-xs border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)] rounded-md disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
