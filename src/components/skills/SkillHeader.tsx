import { formatDistanceToNow } from "date-fns";

interface SkillHeaderProps {
  category: string;
  title: string;
  createdAt: string;
}

export function SkillHeader({ category, title, createdAt }: SkillHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
          {category}
        </span>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>
      </div>
      <span className="text-sm text-[var(--text-secondary)]">
        {formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        })}
      </span>
    </div>
  );
}
