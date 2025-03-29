"use client";

import { Skill } from "@/services/skillsService";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SkillCard({ skill }: { skill: Skill }) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === skill.userId;

  return (
    <Link href={`/skills/${skill.id}`}>
      <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-all h-full">
        {/* Make sure you're accessing properties of the skill object, not rendering the object itself */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{skill.title}</h3>
          {/* Make sure other places where you use skill properties are correct */}
        </div>
        
        {/* Check any other places where you might be accidentally rendering the entire skill object */}
        <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
        
        {/* If you have a category display, make sure it's accessing the property correctly */}
        {skill.category && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
            {typeof skill.category === 'object' ? skill.category.name : skill.category}
          </span>
        )}
        
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
    </Link>
  );
}
