"use client";

import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { use } from "react";
import { Skeleton } from "@/components/common/Skeleton";
import { BackButton } from "@/components/common/BackButton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useSkill } from "@/hooks/useSkill";
import { RequestExchangeButton } from "@/components/skills/RequestExchangeButton";

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { skill, loading, error } = useSkill(resolvedParams.id);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill?.userId;

  if (loading) return <Skeleton />;
  if (error || !skill) return error;

  return (
    <div className="space-y-8">
      <BackButton href="/skills" text="Back to Skills" />
      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg overflow-hidden shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-teal-200">
                {skill.title}
              </h1>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {formatDistanceToNow(new Date(skill.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-[var(--text-primary)] whitespace-pre-line">
              {skill.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-4">
            <div className="flex items-center">
              <UserAvatar name={skill.user.name} />
              <div className="ml-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  Skill Sharer
                </p>
              </div>
            </div>

            {isOwner ? (
              <div className="space-x-2">
                <Link
                  href={`/skills/edit/${skill.id}`}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Edit Skill
                </Link>
              </div>
            ) : (
              <RequestExchangeButton
                skillId={skill.id}
                skillTitle={skill.title}
                skillOwnerId={skill.userId}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
