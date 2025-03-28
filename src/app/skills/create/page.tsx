"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { skillsService } from "@/services/skillsService";
import { useCategories } from "@/hooks/useCategories";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function CreateSkillPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { categories, isLoading, error, refetch } = useCategories();

  // Can refresh categories if needed
  const handleRefresh = async () => {
    await refetch();
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/skills/create");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check session first
    if (!session) {
      setError("You must be logged in to create a skill");
      return;
    }

    // Check form fields
    if (!title.trim() || !description.trim() || !category) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Now TypeScript knows session is not null
      const data = await skillsService.create({
        title: title.trim(),
        description: description.trim(),
        categoryId: category,
        userId: session.user.id, // Safe to access after null check
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/skills/${data.id}`);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create skill");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated" || isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
        <div className="h-8 bg-[var(--card-background)] rounded w-1/3"></div>
        <div className="h-4 bg-[var(--card-background)] rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-10 bg-[var(--card-background)] rounded"></div>
          <div className="h-10 bg-[var(--card-background)] rounded"></div>
          <div className="h-32 bg-[var(--card-background)] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/skills"
          className="inline-flex items-center text-blue-500 hover:underline"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Skills
        </Link>
      </div>

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
          Share Your Skill
        </h1>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">
              Skill created successfully! Redirecting...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-[var(--text-primary)] font-medium mb-1"
              >
                Skill Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What skill can you teach?"
                className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-[var(--text-primary)] font-medium mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-[var(--text-primary)] font-medium mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the skill you can teach, your experience level, and what you'd like to learn in exchange."
                className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)] min-h-[150px]"
                rows={6}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {loading ? "Creating..." : "Create Skill"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
function useEffect(
  arg0: () => void,
  arg1: ("loading" | AppRouterInstance | "authenticated" | "unauthenticated")[]
) {
  throw new Error("Function not implemented.");
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
