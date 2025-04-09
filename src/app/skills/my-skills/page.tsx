"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SkillList } from "@/components/skills/SkillList";
import { Button } from "@/components/ui/Button";

export default function MySkillsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/skills/my-skills");
    }
  }, [status, router]);

  // Handle create skill button click
  const handleCreateSkill = () => {
    router.push("/skills/create");
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Only render content if authenticated
  if (status === "authenticated" && session?.user?.id) {
    return (
      <div className="space-y-8">
        {/* Header with title and action button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              My Skills
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Manage the skills you've shared with the community
            </p>
          </div>

          <Button onClick={handleCreateSkill}>Share New Skill</Button>
        </div>

        {/* Skills list with pagination */}
        <SkillList
          showPagination={true}
          userId={session.user.id}
          showActions={true}
        />
      </div>
    );
  } else if (status === "authenticated") {
    // If authenticated but no user ID (shouldn't happen, but just in case)
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">User ID not found</h3>
        <p className="text-[var(--text-secondary)]">
          There was an issue retrieving your user information. Please try
          signing out and back in.
        </p>
      </div>
    );
  }

  return null; // This will only show briefly during redirects
}
