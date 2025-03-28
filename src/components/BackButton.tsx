import Link from "next/link";

export function BackButton({ href = "/skills" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-blue-500 hover:underline mb-4"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Skills
    </Link>
  );
}
