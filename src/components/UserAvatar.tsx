interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-medium`}
    >
      {name[0].toUpperCase()}
    </div>
  );
}
