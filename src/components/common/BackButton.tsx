import Link from "next/link";

interface BackButtonProps {
  href: string;
  text: string;
  className?: string;
}

export function BackButton({ href, text, className = "" }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className={`
          inline-flex items-center px-4 py-2
          bg-blue-500 text-white rounded-md
          hover:bg-blue-600 transition-colors
          shadow-sm font-medium
          ${className}
        `}
      >
        <svg
          className="w-4 h-4 mr-2"
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
