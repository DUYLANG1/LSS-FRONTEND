"use client";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-[var(--card-background)] border-b border-[var(--card-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link
              href="/"
              className="font-bold text-xl text-[var(--text-primary)]"
            >
              SkillSwap
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/skills"
              className="text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              Browse Skills
            </Link>
            <Link
              href="/dashboard"
              className="text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              Profile
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--card-border)]"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
