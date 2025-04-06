"use client";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-8 my-12"
    >
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
            Browse through available skills and connect with people who can help
            you
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
  );
}
