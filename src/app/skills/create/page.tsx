"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef, FormEvent, useEffect, useState } from "react"; // Added useState
import { skillsService, SkillLevel } from "@/services/skillsService"; // Import SkillLevel enum
import { useCategories } from "@/hooks/useCategories";
import { BackButton } from "@/components/common/BackButton";
import {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextArea,
  FormField,
} from "@/components/ui/Form";
import { Skeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/Button";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

// Use the CreateSkillData interface from skillsService
import type { CreateSkillData } from "@/services/skillsService";

// Removed CreateSkillPageProps interface and initialData prop
export default function CreateSkillPage() {
  // Create refs for form elements
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null); // Use state for error display

  const router = useRouter();
  const { data: session, status } = useSession();
  const { categories, isLoading } = useCategories();

  // Removed useEffect for initialData

  // First useEffect for authentication check remains the same
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/skills/create");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors using state setter

    // Get values from refs (remains the same)
    const title = titleRef.current?.value?.trim() || "";
    const categoryId = categoryRef.current?.value || "";
    const levelValue = levelRef.current?.value || "";
    const description = descriptionRef.current?.value?.trim() || "";

    if (!session?.user?.id) {
      setError("You must be logged in to create a skill");
      return;
    }

    try {
      // Validate inputs
      if (!title) {
        setError("Title is required");
        return;
      }

      if (!categoryId) {
        setError("Category is required");
        return;
      }

      if (!description) {
        setError("Description is required");
        return;
      }

      // Skill data construction
      const skillData: CreateSkillData = {
        title: title,
        description: description,
        categoryId: categoryId,
        // Only include level if a value is selected
        ...(levelValue ? { level: levelValue as SkillLevel } : {}),
        // Note: userId is passed as a separate parameter, not in the skillData object
      };

      console.log("Creating skill with data:", {
        title: skillData.title,
        description: skillData.description,
        categoryId: skillData.categoryId,
        level: skillData.level,
      });

      // Call create with skillData and userId separately
      const response = await skillsService.create(skillData, session.user.id);

      console.log("Skill creation response:", response);

      if (response.id) {
        // Reset form
        if (titleRef.current) titleRef.current.value = "";
        if (categoryRef.current) categoryRef.current.value = "";
        if (levelRef.current) levelRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";

        router.push(`/skills/${response.id}`);
      } else {
        // Handle cases where response might not have an ID but no error was thrown
        setError("Failed to create skill. Please try again.");
      }
    } catch (err) {
      console.error("Error creating skill:", err);

      // More detailed error handling
      if (err instanceof Error) {
        if (
          err.message.includes("401") ||
          err.message.includes("unauthorized")
        ) {
          setError("Authentication error. Please sign in again.");
        } else if (err.message.includes("400")) {
          setError("Invalid data. Please check your inputs and try again.");
        } else {
          // Show the full error message for debugging
          setError(`Error: ${err.message}`);
          console.error("Full error details:", err);
        }
      } else {
        setError("An unexpected error occurred while creating the skill");
        console.error("Non-Error object thrown:", err);
      }
    }
  };

  // Loading state check remains the same
  if (status === "loading" || isLoading) {
    return <Skeleton variant="card" count={3} className="max-w-2xl mx-auto" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BackButton remains the same */}
      <BackButton
        href="/skills"
        text="Back to Skills"
        className="mb-6 hover:text-[var(--text-primary)] transition-colors"
      />

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-8 shadow-lg">
        <div className="mb-8">
          {/* Update title and description to always be for creating */}
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Share Your Skill
          </h1>
          <p className="text-[var(--text-secondary)]">
            Fill out the form below to share your skill with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Use state variable for error display */}
          {error && <ErrorDisplay error={error} className="animate-fade-in" />}

          {/* FormFieldWrapper for Category remains the same */}
          <FormField
            id="category"
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
              className="h-full w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              defaultValue="" // Add a default empty value
            >
              <option value="" disabled>
                Select a category
              </option>{" "}
              {/* Add placeholder option */}
            </FormSelect>
          </FormField>

          {/* FormFieldWrapper for Title remains the same */}
          <FormField
            id="title"
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
              minLength={2} // Add minLength for basic validation
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </FormField>

          {/* Add FormFieldWrapper for Skill Level */}
          {/* <FormField
            id="level"
            label="Skill Level"
            tooltip="Select your proficiency level in this skill"
            className="space-y-2"
          >
            <FormSelect
              ref={levelRef}
              id="level"
              name="level"
              options={Object.values(SkillLevel).map((level) => ({
                id: level,
                name: level.charAt(0) + level.slice(1).toLowerCase(),
              }))}
              className="h-full w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              defaultValue=""
            >
              <option value="">Select a level (optional)</option>
              {Object.values(SkillLevel).map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </FormSelect>
          </FormField> */}

          {/* FormFieldWrapper for Description remains the same */}
          <FormField
            id="description"
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
              minLength={5} // Add minLength for basic validation
              className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
            />
          </FormField>

          <div className="pt-6 border-t border-[var(--card-border)] flex justify-end">
            {/* Update button text to always be for creating */}
            <Button
              type="submit"
              variant="default"
              className="w-full sm:w-auto px-6 py-3 text-lg font-medium transition-all hover:shadow-md"
              // Add a loading state if needed
            >
              Publish Skill
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
