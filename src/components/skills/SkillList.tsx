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
  skills: Skill[];
}

export default function SkillList({ skills }: SkillListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          title={skill.title}
          description={skill.description}
          category={skill.category}
          userAvatar={skill.userAvatar}
          userName={skill.userName}
        />
      ))}
    </div>
  );
}
