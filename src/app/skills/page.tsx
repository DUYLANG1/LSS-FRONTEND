"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { SkillList } from "@/components/skills/SkillList";
import { Button } from "@/components/common/Button";
import { Card, CardBody } from "@/components/common/Card";
import { useSession } from "next-auth/react";

export default function SkillsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const { categories, isLoading } = useCategories();
  const router = useRouter();
  const { data: session } = useSession();

  // Replace controlled input with refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Update state when URL params change
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    // Update the search input value directly
    if (searchInputRef.current && search !== searchInputRef.current.value) {
      searchInputRef.current.value = search;
    }

    setSearchQuery(search);

    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [searchParams, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Get value directly from ref
    const searchValue = searchInputRef.current?.value || "";
    setSearchQuery(searchValue);
    updateURL(selectedCategory, searchValue);
  };

  const handleCategoryChange = (category: string | null) => {
    console.log("Category changed to:", category); // Add this debug line
    setSelectedCategory(category);
    // Get current search value from ref
    const searchValue = searchInputRef.current?.value || "";
    updateURL(category, searchValue);
  };

  const updateURL = (newCategory?: string | null, newSearch?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Use the provided search value or get it from the ref
    const searchToUse =
      newSearch !== undefined ? newSearch : searchInputRef.current?.value || "";

    // Only set search param if there's actually a search value
    if (searchToUse) {
      params.set("search", searchToUse);
    } else {
      params.delete("search");
    }

    // Handle category parameter separately from search
    const categoryToUse =
      newCategory !== undefined ? newCategory : selectedCategory;
    if (categoryToUse) {
      params.set("category", categoryToUse);
    } else {
      params.delete("category");
    }

    params.delete("page");
    router.push(`/skills?${params.toString()}`);
  };

  if (!categories) {
    return <div className="animate-pulse">Loading categories...</div>;
  }

  const handleCreateSkill = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/skills/create");
    } else {
      router.push("/skills/create");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Browse Skills
        </h1>
        <Button variant="primary" onClick={handleCreateSkill}>
          Share Your Skill
        </Button>
      </div>

      <Card>
        <CardBody>
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                ref={searchInputRef}
                defaultValue={searchQuery}
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

            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
        </CardBody>
      </Card>

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
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded-full text-sm flex items-center">
                {categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
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
