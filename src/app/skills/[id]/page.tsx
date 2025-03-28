"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { BackButton } from "@/components/common/BackButton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { ExchangeModal } from "@/components/exchanges/ExchangeModal";
import { useSkill } from "@/hooks/useSkill";

export default function SkillDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const { skill, loading, error } = useSkill(params.id);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill?.userId;

  if (loading) return <LoadingState />;
  if (error || !skill) return <ErrorState error={error} />;

  return (
    <div className="space-y-8">
      <BackButton />

      <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg overflow-hidden shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                {skill.categoryId}
              </span>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
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
                <p className="font-medium text-[var(--text-primary)]">
                  {skill.user.name}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Skill Sharer
                </p>
              </div>
            </div>

            {isOwner ? (
              <div className="space-x-2">
                <Link
                  href={`/skills/${skill.id}/edit`}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Edit Skill
                </Link>
              </div>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setExchangeModalOpen(true)}
              >
                Request Skill Exchange
              </button>
            )}
          </div>
        </div>
      </div>

      <ExchangeModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        onConfirm={() => {
          // TODO: Implement exchange request logic
          setExchangeModalOpen(false);
        }}
        userName={skill.user.name}
      />
    </div>
  );
}
