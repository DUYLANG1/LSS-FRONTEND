"use client";

import { Skill } from "@/services/skillsService";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill.userId;

  return (
    <Link href={`/skills/${skill.id}`}>
      <div
        className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {skill.category}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {formatDistanceToNow(new Date(skill.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            {skill.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
            {skill.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {skill.user.name[0].toUpperCase()}
              </div>
              <span className="ml-2 text-sm font-medium text-[var(--text-primary)]">
                {skill.user.name}
              </span>
            </div>

            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-opacity ${
                isHovered ? "opacity-100" : "opacity-0"
              } ${
                isOwner ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (isOwner) {
                  // Handle edit
                } else {
                  // Handle request exchange
                }
              }}
            >
              {isOwner ? "Edit" : "Request"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
