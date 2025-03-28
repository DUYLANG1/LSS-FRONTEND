import Link from "next/link";

interface BackButtonProps {
  href: string;
  text: string;
}

export function BackButton({ href, text }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center text-blue-500 hover:underline"
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
        {text}
      </Link>
    </div>
  );
}
