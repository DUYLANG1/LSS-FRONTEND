"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LandingHero() {
  const router = useRouter();
  const { data: session } = useSession();

  // Handle create skill button click
  const handleCreateSkill = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/skills/create");
    } else {
      router.push("/skills/create");
    }
  };

  return (
    <section className="text-center py-12 mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Share Your Skills, Learn New Ones
      </h1>
      <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
        Join our community of skill-sharing enthusiasts and start exchanging
        knowledge today
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleCreateSkill}
          className="inline-flex items-center justify-center rounded-md font-medium h-12 px-8 text-base bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        >
          Share Your Skill
        </button>
        <Link
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-md font-medium h-12 px-8 text-base border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]"
        >
          How It Works
        </Link>
      </div>
    </section>
  );
}