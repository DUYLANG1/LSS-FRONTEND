"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, FormEvent, use } from "react";
import {
  Skill,
  skillsService,
  CreateSkillData,
} from "@/services/skillsService";
import { Skeleton } from "@/components/common/Skeleton";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { useCategories } from "@/hooks/useCategories";
import {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextArea,
  FormFieldWrapper,
} from "@/components/skills/FormReuse";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [skillData, setSkillData] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const resolvedParams = use(params);
  const skillId = resolvedParams.id;

  useEffect(() => {
    const titleFromQuery = searchParams.get("title");
    const descriptionFromQuery = searchParams.get("description");
    const categoryIdFromQuery = searchParams.get("categoryId");

    if (titleFromQuery && titleRef.current) {
      titleRef.current.value = titleFromQuery;
    }

    if (descriptionFromQuery && descriptionRef.current) {
      descriptionRef.current.value = descriptionFromQuery;
    }

    if (categoryIdFromQuery && categoryRef.current && !categoriesLoading) {
      categoryRef.current.value = categoryIdFromQuery;
    }
  }, [searchParams, categoriesLoading]);

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

        if (skill.userId !== session?.user?.id) {
          setError("You are not authorized to edit this skill.");
          router.push("/skills");
          return;
        }

        setSkillData(skill);
        const titleFromQuery = searchParams.get("title");
        const descriptionFromQuery = searchParams.get("description");
        const categoryIdFromQuery = searchParams.get("categoryId");

        if (!titleFromQuery && titleRef.current) {
          titleRef.current.value = skill.title;
        }

        if (!descriptionFromQuery && descriptionRef.current) {
          descriptionRef.current.value = skill.description;
        }

        if (!categoryIdFromQuery && categoryRef.current && !categoriesLoading) {
          categoryRef.current.value = skill.categoryId;
        }
      } catch (fetchError) {
        console.error("Failed to load skill:", fetchError);
        setError(
          "Failed to load skill details. It might not exist or an error occurred."
        );
      } finally {
        // Remove the conditional check that's causing the infinite loading
        setLoading(false);
      }
    }

    if (status === "authenticated" && skillId) {
      loadSkill();
    } else if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/skills/edit/${skillId}`);
    }
  }, [
    skillId,
    session?.user?.id,
    status,
    router,
    categoriesLoading,
    searchParams,
  ]);

  useEffect(() => {
    if (skillData && categoryRef.current && !categoriesLoading) {
      categoryRef.current.value = skillData.categoryId;
    }
  }, [skillData, categoriesLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const title = titleRef.current?.value?.trim() || "";
    const categoryId = categoryRef.current?.value || "";
    const description = descriptionRef.current?.value?.trim() || "";

    if (!skillData?.id) {
      setError("Skill ID is missing, cannot update.");
      return;
    }
    if (!session?.user?.id) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      const updateData: Partial<CreateSkillData> = {
        title: title,
        description: description,
        categoryId: categoryId,
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
    }
  };

  if (status === "loading" || loading || categoriesLoading) {
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
          <FormFieldWrapper
            htmlFor="category"
            label="Category"
            tooltip="Select the most relevant category for your skill"
            required
            className="space-y-2"
          >
            <FormSelect
              ref={categoryRef}
              id="category"
              name="category"
              options={categories}
              required
              className="w-full"
            >
              <option value="">Select a category</option>
            </FormSelect>
          </FormFieldWrapper>

          <FormFieldWrapper
            htmlFor="title"
            label="Title"
            tooltip="Give your skill a clear, descriptive title"
            required
            className="space-y-2"
          >
            <FormInput
              ref={titleRef}
              id="title"
              name="title"
              placeholder="e.g., JavaScript Programming, Guitar Lessons"
              required
              minLength={2}
              className="w-full"
              defaultValue={skillData?.title || ""} // Change value to defaultValue
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            htmlFor="description"
            label="Description"
            tooltip="Describe what you can teach, your experience level, and what learners can expect"
            required
            className="space-y-2"
          >
            <FormTextArea
              ref={descriptionRef}
              id="description"
              name="description"
              placeholder="Provide details about your skill, experience level, and what you can teach..."
              required
              rows={5}
              minLength={5}
              className="w-full"
              defaultValue={skillData?.description || ""} // Change value to defaultValue
            />
          </FormFieldWrapper>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/skills/${skillId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
