interface SkillCardProps {
  title: string;
  description: string;
  category: string;
  userAvatar: string;
  userName: string;
}

export default function SkillCard({
  title,
  description,
  category,
  userAvatar,
  userName,
}: SkillCardProps) {
  return (
    <div className="border border-[var(--card-border)] bg-[var(--card-background)] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={userAvatar}
          alt={userName}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-medium text-[var(--text-primary)]">
          {userName}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] mb-3">{description}</p>
      <span className="inline-block bg-[var(--card-border)] text-[var(--text-primary)] px-3 py-1 rounded-full text-sm">
        {category}
      </span>
    </div>
  );
}
