import SkillCard from "./SkillCard";

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  userAvatar: string;
  userName: string;
}

interface SkillListProps {
  searchQuery: string;
  category: string | null;
}

export function SkillList({ searchQuery, category }: SkillListProps) {
  return (
    <div className="space-y-4">
      {/* Add your skill list implementation here */}
    </div>
  );
}
