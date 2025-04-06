import { useState, useEffect, useCallback } from "react";
import { categoriesService } from "@/services/categoriesService";
import { Category } from "@/services/categoriesService";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchCategories: (query: string) => void;
}

export function useCategories(): UseCategoriesResult {
  // Always initialize with empty arrays to prevent undefined
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCategories(data);
        setFilteredCategories(data);
      } else {
        console.error("Categories data is not an array:", data);
        setCategories([]);
        setFilteredCategories([]);
        setError("Invalid categories data format");
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const searchCategories = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Ensure we always return an array for categories
  const safeFilteredCategories = Array.isArray(filteredCategories)
    ? filteredCategories
    : [];

  return {
    categories: safeFilteredCategories,
    isLoading,
    error,
    refetch: loadCategories,
    searchCategories,
  };
}
