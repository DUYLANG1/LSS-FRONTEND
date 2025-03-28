"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { SkillList } from "@/components/skills/SkillList";

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading } = useCategories();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    setSearchQuery(search);
    setSelectedCategory(category);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    // Reset to page 1 when search/filter changes
    params.delete("page");

    router.push(`/skills?${params.toString()}`);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);

    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Reset to page 1 when filter changes
    params.delete("page");

    router.push(`/skills?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Browse Skills
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => router.push("/skills/create")}
        >
          Share Your Skill
        </button>
      </div>

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for skills..."
              className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedCategory || ""}
              onChange={(e) => handleCategoryChange(e.target.value || null)}
              className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-[var(--card-background)] rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[var(--card-background)] rounded"></div>
              <div className="h-4 bg-[var(--card-background)] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedCategory && (
            <div className="flex items-center">
              <span className="mr-2 text-[var(--text-secondary)]">
                Filtered by:
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          <SkillList searchQuery={searchQuery} category={selectedCategory} />
        </div>
      )}
    </div>
  );
}
