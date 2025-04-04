"use client";

import { Skill } from "@/services/skillsService";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RequestExchangeButton } from "./RequestExchangeButton";

export default function SkillCard({ skill }: { skill: Skill }) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill.userId;
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/skills/edit/${skill.id}`);
  };

  return (
    <Link href={`/skills/${skill.id}`}>
      <div
        className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-all h-full ${
          isOwner
            ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50"
            : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {skill.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(skill.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4 line-clamp-2">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skill.category && (
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full inline-flex items-center">
              {typeof skill.category === "object"
                ? skill.category.name
                : skill.category}
            </span>
          )}

          {/* Removed the skill level indicator that was causing the error */}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
              {skill.user.name[0].toUpperCase()}
            </div>
          </div>

          {isOwner ? (
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isHovered ? "scale-105" : "scale-100"
              } bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`}
              onClick={(e) => {
                e.preventDefault();
                handleEdit(e);
              }}
            >
              Edit
            </button>
          ) : (
            <div onClick={(e) => e.preventDefault()}>
              <RequestExchangeButton
                skillId={skill.id}
                skillTitle={skill.title}
                skillOwnerId={skill.userId}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all 
                  ${isHovered ? "scale-110" : "scale-100"} 
                  bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                  hover:from-blue-600 hover:to-blue-700
                  dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600
                  shadow-sm hover:shadow-md border border-blue-400 dark:border-blue-800
                  animate-pulse-subtle`}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
