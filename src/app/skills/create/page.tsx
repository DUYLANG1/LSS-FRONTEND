"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { skillsService } from "@/services/skillsService";
import { useCategories } from "@/hooks/useCategories";
import { useEffect } from "react";
import { BackButton } from "@/components/common/BackButton";
import {
  FormLabel,
  FormInput,
  FormSelect,
} from "@/components/skills/FormReuse";
import { LoadingState } from "@/components/common/LoadingState";

interface CreateSkillForm {
  title: string;
  description: string;
  categoryId: string;
}

interface CreateSkillData extends CreateSkillForm {
  userId: string;
}

export default function CreateSkillPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    reset,
  } = useForm<CreateSkillForm>();

  const router = useRouter();
  const { data: session, status } = useSession();
  const { categories, isLoading } = useCategories();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/skills/create");
    }
  }, [status, router]);

  const onSubmit = async (data: CreateSkillForm) => {
    if (!session?.user?.id) {
      setFormError("root", {
        message: "You must be logged in to create a skill",
      });
      return;
    }

    try {
      const skillData: CreateSkillData = {
        title: data.title.trim(),
        description: data.description.trim(),
        categoryId: data.categoryId,
        userId: session.user.id,
      };

      // Log request data for debugging
      console.log("Sending skill data:", skillData);

      const response = await skillsService.create(skillData);

      if (response.id) {
        reset();
        router.push(`/skills/${response.id}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error creating skill:", err);

      // More specific error handling
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while creating the skill";

      setFormError("root", {
        message: errorMessage,
      });
    }
  };

  if (status === "loading" || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton href="/skills" text="Back to Skills" />

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
          Share Your Skill
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.root.message}
            </div>
          )}

          <div>
            <FormLabel htmlFor="title">Skill Title *</FormLabel>
            <FormInput
              register={register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              id="title"
              placeholder="What skill can you teach?"
              error={errors.title?.message}
            />
          </div>

          <div>
            <FormLabel htmlFor="categoryId">Category *</FormLabel>
            <FormSelect
              register={register("categoryId", {
                required: "Please select a category",
                validate: (value) => !!value || "Category is required",
              })}
              id="categoryId"
              options={categories}
              error={errors.categoryId?.message}
            />
          </div>

          <div>
            <FormLabel htmlFor="description">Description *</FormLabel>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
              })}
              id="description"
              placeholder="Describe the skill you can teach, your experience level, and what you'd like to learn in exchange."
              className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)] min-h-[150px]"
              rows={6}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg ${
                isSubmitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
