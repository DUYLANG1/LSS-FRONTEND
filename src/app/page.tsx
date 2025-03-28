import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-6">
        Share Your Skills, Learn New Ones
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Join our community of skill-sharing enthusiasts and start exchanging
        knowledge today
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/skills"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Browse Skills
        </Link>
        <Link
          href="/dashboard"
          className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200"
        >
          Create Skill Swap
        </Link>
      </div>
    </div>
  );
}
