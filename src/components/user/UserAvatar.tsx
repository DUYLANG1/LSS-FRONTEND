interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  imageUrl?: string;
  className?: string;
}

export function UserAvatar({ name, size = "md", imageUrl, className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white font-medium ${className}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        name[0].toUpperCase()
      )}
    </div>
  );
}
