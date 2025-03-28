import Link from "next/link";

interface ErrorStateProps {
  error: string | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
        {error || "Not found"}
      </h2>
      <Link
        href="/skills"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Browse Other Skills
      </Link>
    </div>
  );
}
