"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef, FormEvent, useEffect } from "react";
import { Skill, skillsService } from "@/services/skillsService";
import { useCategories } from "@/hooks/useCategories";
import { BackButton } from "@/components/common/BackButton";
import {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextArea,
  FormFieldWrapper,
} from "@/components/skills/FormReuse";
import { Skeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/common/Button";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

interface CreateSkillData {
  title: string;
  description: string;
  categoryId: string;
  userId: string;
}

interface CreateSkillPageProps {
  initialData?: Skill;
}

export default function CreateSkillPage({ initialData }: CreateSkillPageProps) {
  // Create refs for form elements
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const errorRef = useRef<string | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { categories, isLoading } = useCategories();

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      if (titleRef.current) titleRef.current.value = initialData.title;
      if (descriptionRef.current)
        descriptionRef.current.value = initialData.description;
      if (categoryRef.current)
        categoryRef.current.value = initialData.categoryId;
    }
  }, [initialData]);

  // First useEffect for authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/skills/create");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    errorRef.current = null;

    // Get values from refs
    const title = titleRef.current?.value?.trim() || "";
    const categoryId = categoryRef.current?.value || "";
    const description = descriptionRef.current?.value?.trim() || "";

    // Validate form
    if (!title) {
      errorRef.current = "Title is required";
      return;
    }

    if (title.length < 2) {
      errorRef.current = "Title must be at least 2 characters";
      return;
    }

    if (!categoryId) {
      errorRef.current = "Please select a category";
      return;
    }

    if (!description) {
      errorRef.current = "Description is required";
      return;
    }

    if (description.length < 5) {
      errorRef.current = "Description must be at least 5 characters";
      return;
    }

    if (!session?.user?.id) {
      errorRef.current = "You must be logged in to create a skill";
      return;
    }

    try {
      const skillData: CreateSkillData = {
        title: titleRef.current?.value?.trim() || "",
        description: descriptionRef.current?.value?.trim() || "",
        categoryId: categoryRef.current?.value || "",
        userId: session.user.id,
      };

      let response;
      if (initialData) {
        // Update existing skill
        response = await skillsService.update(initialData.id, skillData);
      } else {
        // Create new skill
        response = await skillsService.create(skillData);
      }

      if (response.id) {
        // Reset form
        if (titleRef.current) titleRef.current.value = "";
        if (categoryRef.current) categoryRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";

        router.push(`/skills/${response.id}`);
      }
    } catch (err) {
      console.error("Error creating skill:", err);

      // More specific error handling
      errorRef.current =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while creating the skill";
    }
  };

  if (status === "loading" || isLoading) {
    return <Skeleton variant="card" count={3} className="max-w-2xl mx-auto" />;
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
            {initialData ? "Edit Your Skill" : "Share Your Skill"}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {initialData
              ? "Update your skill details below"
              : "Fill out the form below to share your skill with the community"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errorRef.current && (
            <ErrorDisplay
              error={errorRef.current}
              className="animate-fade-in"
            />
          )}

          <FormFieldWrapper
            htmlFor="category"
            label="Category"
            tooltip="Select the most relevant category for your skill"
            required // Indicate this field is required
            className="space-y-2"
          >
            <FormSelect
              ref={categoryRef}
              id="category"
              name="category"
              options={categories.map((c) => ({ id: c.id, name: c.name }))}
              required
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            htmlFor="title"
            label="Skill Title"
            tooltip="Be specific about what skill you're offering (min. 2 characters)"
            required // Indicate this field is required
            className="space-y-2"
          >
            <FormInput
              ref={titleRef}
              id="title"
              name="title"
              placeholder="e.g. JavaScript Programming, Guitar Lessons"
              required
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            htmlFor="description"
            label="Description"
            tooltip="Detailed descriptions get more interest (min. 5 characters)"
            required // Indicate this field is required
            className="space-y-2"
          >
            <FormTextArea
              ref={descriptionRef}
              id="description"
              name="description"
              placeholder="Describe your skill in detail. Include your experience level, teaching approach, and any requirements."
              required
              rows={6}
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
            />
          </FormFieldWrapper>

          <div className="pt-6 border-t border-[var(--card-border)] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto px-6 py-3 text-lg font-medium transition-all hover:shadow-md"
            >
              {initialData ? "Update Skill" : "Publish Skill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
