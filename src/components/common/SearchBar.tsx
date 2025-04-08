"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: (search: string, category: string | null) => void;
  autoSubmit?: boolean;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  autoSubmit = true,
  debounceMs = 500,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, isLoading } = useCategories();

  // Get initial values from URL
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Update state when URL params change
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    setSearchQuery(search);
    setSelectedCategory(category);

    // Only depend on searchParams to avoid circular dependencies
  }, [searchParams]);

  // Update URL with search parameters
  const updateURL = React.useCallback(
    (newCategory?: string | null, newSearch?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Use the provided search value or current state
      const searchToUse = newSearch !== undefined ? newSearch : searchQuery;

      console.log("Updating URL with search:", searchToUse);

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

      // Reset to page 1 when search criteria change
      params.delete("page");

      // Log the final URL parameters
      console.log("Final URL params:", params.toString());

      // Update the URL without causing a full page refresh
      const url = `/skills?${params.toString()}`;
      router.push(url);
    },
    [searchParams, searchQuery, selectedCategory, router]
  );

  // Create debounced search function
  const debouncedSearch = React.useCallback(
    debounce((search: string, category: string | null) => {
      console.log("Debounced search triggered with:", { search, category });
      if (onSearch) {
        onSearch(search, category);
      } else {
        updateURL(category, search);
      }
    }, debounceMs),
    [onSearch, debounceMs, updateURL]
  );

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { searchQuery, selectedCategory });

    if (onSearch) {
      onSearch(searchQuery, selectedCategory);
    } else {
      // Use updateURL directly for immediate feedback
      updateURL(selectedCategory, searchQuery);
    }
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const category = value || null;

    // Update local state immediately for responsive UI
    setSelectedCategory(category);

    console.log("Category changed to:", category);

    // For category changes, always update immediately for a responsive feel
    if (autoSubmit) {
      if (onSearch) {
        onSearch(searchQuery, category);
      } else {
        // Use updateURL directly for immediate feedback
        updateURL(category, searchQuery);
      }
    }
  };

  // Handle search input change for auto-submit
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Always trigger the debounced search when autoSubmit is true
    if (autoSubmit) {
      console.log("Auto-submitting search:", value);
      // Use the updateURL function directly for immediate feedback
      updateURL(selectedCategory, value);
    }
  };

  // Ensure categories is an array and has the expected structure
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Prepare category options for the select component
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(safeCategories
      .map((category) => {
        // Additional safety check for category structure
        if (
          category &&
          typeof category === "object" &&
          "id" in category &&
          "name" in category
        ) {
          return {
            value: String(category.id), // Ensure ID is a string
            label: category.name,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ value: string; label: string }>),
  ];

  return (
    <Card className="bg-[var(--card-background)] border border-[var(--card-border)] shadow-md">
      <CardBody className="p-3 sm:p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search input */}
            <div className={"md:col-span-7"}>
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search for skills..."
                className="pl-10 h-12 w-full"
                aria-label="Search input"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--text-secondary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category dropdown */}
            <div className="md:col-span-3">
              <Select
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                options={categoryOptions}
                className="h-12 w-full"
                aria-label="Category filter"
                // Note: disabled state can be used instead of isLoading
                disabled={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full h-12"
                variant="default"
                aria-label="Search button"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
