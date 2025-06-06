import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", className = "", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-[var(--card-border)] rounded-full animate-spin border-t-[var(--primary)]`}></div>
      </div>
      {text && <p className="mt-2 text-[var(--text-secondary)]">{text}</p>}
    </div>
  );
}