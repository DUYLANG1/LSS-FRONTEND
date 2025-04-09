import React from "react";
import { useSkills } from "@/hooks/useSkills";

interface DirectUserIdExampleProps {
  userId: string;
}

export const DirectUserIdExample: React.FC<DirectUserIdExampleProps> = ({
  userId,
}) => {
  // Use the new directUserId option to fetch skills with the direct URL format
  const { skills, isLoading, error } = useSkills({
    directUserId: userId,
    autoFetch: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Skills for User ID: {userId}</h2>
      {skills.length === 0 ? (
        <p>No skills found for this user.</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <p>Level: {skill.level}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example usage:
// <DirectUserIdExample userId="cm8s8neis0000fzbwkqvcuawz" />
