import { useState, useEffect } from "react";
import { categoriesService } from "@/services/categoriesService";
import { Category } from "@/services/categoriesService";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: loadCategories, // Expose refetch function for manual refreshing
  };
}
