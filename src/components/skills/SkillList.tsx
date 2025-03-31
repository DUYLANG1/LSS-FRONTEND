"use client";

import { useEffect, useState } from "react";
import { Skill, skillsService } from "@/services/skillsService";
import SkillCard from "./SkillCard";
import { useRouter, useSearchParams } from "next/navigation";

export interface SkillListProps {
  searchQuery?: string;
  category?: string | null;
}

export function SkillList({ searchQuery = "", category }: SkillListProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Add this state to store previous skills while loading new ones
  const [previousSkills, setPreviousSkills] = useState<Skill[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Add a debounce delay to prevent rapid loading states
  const [debouncedLoading, setDebouncedLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      // Delay showing loading state to prevent flicker on quick responses
      timer = setTimeout(() => {
        setDebouncedLoading(true);
      }, 300); // Only show loading indicator after 300ms
    } else {
      setDebouncedLoading(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        // Store current skills before fetching new ones
        if (skills.length > 0) {
          setPreviousSkills(skills);
        }

        const params: any = {
          page,
          limit,
          search: searchQuery,
        };

        if (category) {
          params.category = category;
        }

        const response = await skillsService.getAll(params);
        setSkills(response.skills);
        setTotalPages(Math.ceil(response.totalCount / limit));
      } catch (err) {
        setError("Failed to load skills. Please try again later.");
        console.error(err);
      } finally {
        // Add a minimum loading time to prevent rapid flashing
        const minLoadingTime = 300;
        const loadingStartTime = Date.now();
        const timeElapsed = Date.now() - loadingStartTime;

        if (timeElapsed < minLoadingTime) {
          setTimeout(() => {
            setLoading(false);
          }, minLoadingTime - timeElapsed);
        } else {
          setLoading(false);
        }
      }
    }

    loadSkills();
  }, [page, searchQuery, category]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/skills?${params.toString()}`);
  };

  // Modify the loading condition to only show skeleton on first load
  if (loading && page === 1 && previousSkills.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-[var(--card-background)] rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setPage(1)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">No skills found</h3>
        <p className="text-[var(--text-secondary)]">
          {searchQuery || category
            ? "Try adjusting your search or filter criteria."
            : "Be the first to add a skill!"}
        </p>
      </div>
    );
  }

  // Define the displaySkills variable here
  const displaySkills = loading && skills.length > 0 ? previousSkills : skills;

  // Use debounced loading state for the indicator
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {/* Use debounced loading for smoother transitions */}
      {debouncedLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg transition-opacity duration-300">
          Loading...
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-[var(--card-border)] disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    pageNumber === page
                      ? "bg-blue-500 text-white"
                      : "border border-[var(--card-border)]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-[var(--card-border)] disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
