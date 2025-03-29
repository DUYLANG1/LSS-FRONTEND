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
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      setFilteredCategories(data);
      setError(null);
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
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const searchCategories = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    categories: filteredCategories,
    isLoading,
    error,
    refetch: loadCategories,
    searchCategories,
  };
}
