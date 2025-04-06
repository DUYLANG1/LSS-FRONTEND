"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { SkillList } from "@/components/skills/SkillList";

export default function Home() {
  const { categories } = useCategories();

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
          <Link
            href="/skills/create"
            className="inline-flex items-center justify-center rounded-md font-medium h-12 px-8 text-base border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]"
          >
            Share Your Skill
          </Link>
        </div>
      </section>

      {/* Featured categories */}
      {categories && categories.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Popular Categories</h2>
            <p className="text-[var(--text-secondary)]">
              Explore skills by category
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
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
            ))}
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
      <section className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          How SkillSwap Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Share Your Skills</h3>
            <p className="text-[var(--text-secondary)]">
              Create a profile and list the skills you're willing to share with
              others
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Find Skills You Need</h3>
            <p className="text-[var(--text-secondary)]">
              Browse through available skills and connect with people who can
              help you
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Exchange Knowledge</h3>
            <p className="text-[var(--text-secondary)]">
              Connect and arrange skill exchanges that benefit both parties
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
