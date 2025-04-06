"use client";

import React, { useRef, useState, useEffect } from "react";
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
  autoSubmit = false,
  debounceMs = 500,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, isLoading } = useCategories();

  // Get initial values from URL
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );

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

  // Create debounced search function
  const debouncedSearch = React.useCallback(
    debounce((search: string, category: string | null) => {
      if (onSearch) {
        onSearch(search, category);
      } else {
        updateURL(category, search);
      }
    }, debounceMs),
    [onSearch, debounceMs]
  );

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Get value directly from ref
    const searchValue = searchInputRef.current?.value || "";
    setSearchQuery(searchValue);

    if (onSearch) {
      onSearch(searchValue, selectedCategory);
    } else {
      updateURL(selectedCategory, searchValue);
    }
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value || null;
    setSelectedCategory(category);

    if (autoSubmit) {
      // Get current search value from ref
      const searchValue = searchInputRef.current?.value || "";
      debouncedSearch(searchValue, category);
    }
  };

  // Handle search input change for auto-submit
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (autoSubmit) {
      debouncedSearch(e.target.value, selectedCategory);
    }
  };

  // Update URL with search parameters
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

  // Ensure categories is an array and has the expected structure
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Prepare category options for the select component
  const categoryOptions: Array<{ value: string; label: string }> = [
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
            value: category.id,
            label: category.name,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ value: string; label: string }>), // Remove any null entries and assert type
  ];

  return (
    <Card>
      <CardBody>
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <Input
              type="text"
              ref={searchInputRef}
              defaultValue={searchQuery}
              placeholder="Search for skills..."
              onChange={handleSearchInputChange}
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              options={categoryOptions}
            />
          </div>

          {!autoSubmit && (
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              Search
            </button>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
