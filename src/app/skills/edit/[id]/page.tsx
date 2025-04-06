"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, FormEvent, use } from "react";
import {
  Skill,
  skillsService,
  CreateSkillData,
} from "@/services/skillsService";
import { Skeleton } from "@/components/common/Skeleton";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/Button";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { useCategories } from "@/hooks/useCategories";
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormField,
} from "@/components/form/export";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  // Page state
  const [skillData, setSkillData] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedParams = use(params);
  const skillId = resolvedParams.id;

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Load data from query parameters or skill data
  useEffect(() => {
    // Check for query parameters
    const titleFromQuery = searchParams.get("title");
    const descriptionFromQuery = searchParams.get("description");
    const categoryIdFromQuery = searchParams.get("categoryId");

    // Update form with query parameters if they exist
    setFormData((prev) => ({
      ...prev,
      title: titleFromQuery || prev.title,
      description: descriptionFromQuery || prev.description,
      categoryId: categoryIdFromQuery || prev.categoryId,
    }));
  }, [searchParams]);

  // Load skill data
  useEffect(() => {
    async function loadSkill() {
      if (!skillId) {
        setError("Skill ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const skill = await skillsService.getById(skillId);

        // Check authorization
        if (skill.userId !== session?.user?.id) {
          setError("You are not authorized to edit this skill.");
          router.push("/skills");
          return;
        }

        // Set skill data
        setSkillData(skill);

        // Update form data if no query parameters exist
        setFormData((prev) => ({
          title: prev.title || skill.title,
          description: prev.description || skill.description,
          categoryId: prev.categoryId || skill.categoryId,
        }));
      } catch (error) {
        console.error("Failed to load skill:", error);
        setError(
          "Failed to load skill details. It might not exist or an error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    // Load skill if authenticated
    if (status === "authenticated" && skillId) {
      loadSkill();
    } else if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/skills/edit/${skillId}`);
    }
  }, [skillId, session?.user?.id, status, router]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate required data
    if (!skillData?.id) {
      setError("Skill ID is missing, cannot update.");
      setIsSubmitting(false);
      return;
    }

    if (!session?.user?.id) {
      setError("Authentication error. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updateData: Partial<CreateSkillData> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
      };

      const response = await skillsService.update(skillData.id, updateData);

      if (response.id) {
        router.push(`/skills/${response.id}`);
      } else {
        setError("Failed to update skill. Please try again.");
      }
    } catch (err) {
      console.error("Error updating skill:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while updating the skill"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  const isLoading = status === "loading" || loading || categoriesLoading;
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton href="/skills" text="Back to Skills" className="mb-6" />
        <Skeleton variant="card" count={3} className="max-w-2xl mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton
        href="/skills"
        text="Back to Skills"
        className="mb-6 hover:text-[var(--text-primary)] transition-colors"
      />

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Edit Your Skill
          </h1>
          <p className="text-[var(--text-secondary)]">
            Update your skill information below
          </p>
        </div>

        {error && (
          <ErrorDisplay error={error} className="animate-fade-in mb-6" />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormField
            id="categoryId"
            label="Category"
            tooltip="Select the most relevant category for your skill"
            required
            className="space-y-2"
          >
            <FormSelect
              id="categoryId"
              name="categoryId"
              options={categories}
              required
              className="w-full"
              defaultValue={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
            </FormSelect>
          </FormField>

          <FormField
            id="title"
            label="Title"
            tooltip="Give your skill a clear, descriptive title"
            required
            className="space-y-2"
          >
            <FormInput
              id="title"
              name="title"
              placeholder="e.g., JavaScript Programming, Guitar Lessons"
              required
              minLength={2}
              className="w-full"
              defaultValue={formData.title}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            tooltip="Describe what you can teach, your experience level, and what learners can expect"
            required
            className="space-y-2"
          >
            <FormTextArea
              id="description"
              name="description"
              placeholder="Provide details about your skill, experience level, and what you can teach..."
              required
              rows={5}
              minLength={5}
              className="w-full"
              defaultValue={formData.description}
              onChange={handleChange}
            />
          </FormField>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/skills/${skillId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
