"use client";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { UserRole } from "@/utils/permissions";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") {
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
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

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
          <div className="flex items-center space-x-4">
            <Link
              href="/skills"
              className="text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
            >
              Browse Skills
            </Link>
            {session && (
              <Link
                href="/exchanges"
                className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--card-border)]"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Exchanges
              </Link>
            )}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="z-10 absolute right-0 mt-2 w-48 py-2 bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg shadow-xl">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--card-border)]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {session.user?.role === UserRole.ADMIN && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--card-border)]"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[var(--card-border)]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
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
