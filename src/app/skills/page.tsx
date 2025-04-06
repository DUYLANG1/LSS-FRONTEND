"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SearchBar } from "@/components/common/SearchBar";
import { SkillList } from "@/components/skills/SkillList";
import { useCategories } from "@/hooks/useCategories";

export default function SkillsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { categories } = useCategories();

  // Handle create skill button click
  const handleCreateSkill = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/skills/create");
    } else {
      router.push("/skills/create");
    }
  };

  // Get current category from URL if it exists
  const currentCategory = searchParams.get("category");
  const currentCategoryName =
    currentCategory && categories
      ? categories.find((c) => c.id === currentCategory)?.name
      : null;

  return (
    <div className="space-y-8">
      {/* Header with title and action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {currentCategoryName
              ? `${currentCategoryName} Skills`
              : "Browse Skills"}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {currentCategoryName
              ? `Explore skills in the ${currentCategoryName} category`
              : "Discover skills shared by our community members"}
          </p>
        </div>

        <button
          onClick={handleCreateSkill}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        >
          Share Your Skill
        </button>
      </div>

      {/* Search and filter bar */}
      <SearchBar autoSubmit={true} />

      {/* Category chips */}
      {Array.isArray(categories) && categories.length > 0 && (
        <div className="py-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              Browse by category:
            </span>
            {categories.slice(0, 8).map((category) =>
              category && category.id && category.name ? (
                <div
                  key={category.id}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${
                    currentCategory === category.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-border)]/80"
                  }`}
                  onClick={() => router.push(`/skills?category=${category.id}`)}
                >
                  {category.name}
                </div>
              ) : null
            )}
            {currentCategory && (
              <button
                className="text-xs text-[var(--primary)] hover:underline"
                onClick={() => router.push("/skills")}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Skills list with pagination */}
      <SkillList showPagination={true} category={currentCategory} />
    </div>
  );
}
