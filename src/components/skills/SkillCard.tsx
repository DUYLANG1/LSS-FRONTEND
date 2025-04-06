"use client";

import React from "react";
import Link from "next/link";
import { Skill } from "@/services/skillsService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, truncateText } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RequestExchangeButton } from "./RequestExchangeButton";

const SkillLevelColors: Record<string, string> = {
  BEGINNER:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  INTERMEDIATE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  ADVANCED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  EXPERT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
};

interface SkillCardProps {
  skill: Skill;
  showActions?: boolean;
}

export default function SkillCard({
  skill,
  showActions = true,
}: SkillCardProps) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill.userId;
  const router = useRouter();

  const handleEditClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push(`/skills/edit/${skill.id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link
              href={`/skills/${skill.id}`}
              className="hover:text-[var(--primary)] transition-colors"
            >
              {skill.title}
            </Link>
          </CardTitle>
          {skill.level && (
            <div
              className={`${badgeVariants({ variant: "outline" })} ${
                SkillLevelColors[skill.level]
              }`}
            >
              {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-[var(--text-secondary)] mt-1">
          <span className="mr-2">{formatDate(skill.createdAt, "short")}</span>
          <span>•</span>
          <Link
            href={`/skills?category=${skill.category.id}`}
            className="ml-2 hover:text-[var(--primary)] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {skill.category.name}
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-[var(--text-secondary)]">
          {truncateText(skill.description, 120)}
        </p>
      </CardContent>

      <CardFooter className="pt-4 border-t border-[var(--card-border)]">
        <div className="flex items-center justify-between w-full">
          <Link
            href={`/profile/${skill.user.id}`}
            className="flex items-center group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
              {skill.user.avatarUrl ? (
                <img
                  src={skill.user.avatarUrl}
                  alt={skill.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                skill.user.name[0].toUpperCase()
              )}
            </div>
          </Link>

          {showActions && (
            <>
              {isOwner ? (
                <Button variant="secondary" size="sm" onClick={handleEditClick}>
                  Edit
                </Button>
              ) : (
                <div onClick={(e) => e.preventDefault()}>
                  <RequestExchangeButton
                    skillId={skill.id}
                    skillTitle={skill.title}
                    skillOwnerId={skill.userId}
                    className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
