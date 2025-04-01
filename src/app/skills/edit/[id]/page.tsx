"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { use } from "react";
import { Skill, skillsService } from "@/services/skillsService";
import CreateSkillPage from "@/app/skills/create/page";
import { Skeleton } from "@/components/common/Skeleton";

export default function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [initialData, setInitialData] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const resolvedParams = use(params);

  useEffect(() => {
    async function loadSkill() {
      try {
        setLoading(true);
        const skill = await skillsService.getById(resolvedParams.id);
        
        // Verify ownership
        if (skill.userId !== session?.user?.id) {
          router.push("/skills");
          return;
        }
        
        setInitialData(skill);
      } catch (error) {
        console.error("Failed to load skill:", error);
        setError("Failed to load skill details");
        router.push("/skills");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      loadSkill();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [resolvedParams.id, session, status, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!initialData) {
    return <div>Skill not found</div>;
  }

  return <CreateSkillPage initialData={initialData} />;
}
