import Link from "next/link";

interface SkillActionsProps {
  isOwner: boolean;
  skillId: string;
  onExchangeRequest: () => void;
}

export function SkillActions({
  isOwner,
  skillId,
  onExchangeRequest,
}: SkillActionsProps) {
  return isOwner ? (
    <div className="space-x-2">
      <Link
        href={`/skills/${skillId}/edit`}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        Edit Skill
      </Link>
    </div>
  ) : (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      onClick={onExchangeRequest}
    >
      Request Skill Exchange
    </button>
  );
}
