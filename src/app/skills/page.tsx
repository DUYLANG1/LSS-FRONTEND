"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/common/SearchBar";
import { SkillList } from "@/components/skills/SkillList";
import { useCategories } from "@/hooks/useCategories";

export default function SkillsPage() {
  const router = useRouter();
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

  return (
    <div className="space-y-8">
      {/* Header with title and action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Browse Skills
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Discover skills shared by our community members
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

      {/* Featured categories (optional) */}
      {categories && categories.length > 0 && (
        <div className="py-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              Popular categories:
            </span>
            {categories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-border)]/80 cursor-pointer"
                onClick={() => router.push(`/skills?category=${category.id}`)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills list with pagination */}
      <SkillList />
    </div>
  );
}
