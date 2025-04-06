"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/Card";
import { useCategories } from "@/hooks/useCategories";
import { SkillList } from "@/components/skills/SkillList";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { categories } = useCategories();

  // Handle create skill button click
  const handleCreateSkill = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/skills/create");
    } else {
      router.push("/skills/create");
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Share Your Skills, Learn New Ones
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Join our community of skill-sharing enthusiasts and start exchanging
          knowledge today
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/skills"
            className="inline-flex items-center justify-center rounded-md font-medium h-12 px-8 text-base bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          >
            Browse Skills
          </Link>
          <button
            onClick={handleCreateSkill}
            className="inline-flex items-center justify-center rounded-md font-medium h-12 px-8 text-base border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]"
          >
            Share Your Skill
          </button>
        </div>
      </section>

      {/* Featured categories */}
      {Array.isArray(categories) && categories.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Popular Categories</h2>
            <p className="text-[var(--text-secondary)]">
              Explore skills by category
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) =>
              category && category.id && category.name ? (
                <Card
                  key={category.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <Link
                      href={`/skills?category=${category.id}`}
                      className="block h-full"
                    >
                      <h3 className="font-medium mb-1">{category.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {category.count || 0} skills
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Recent skills */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Recently Added Skills</h2>
          <p className="text-[var(--text-secondary)]">
            Check out the latest skills shared by our community
          </p>
        </div>

        <SkillList limit={6} showPagination={false} />

        <div className="text-center mt-8">
          <Link
            href="/skills"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]"
          >
            View All Skills
          </Link>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />
    </div>
  );
}
