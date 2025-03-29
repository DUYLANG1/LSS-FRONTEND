import React from "react";

interface ButtonProps {
  variant?: "primary" | "success" | "danger" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const variants = {
    primary: "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-transparent",
    success: "bg-green-500 hover:bg-green-600 dark:hover:bg-green-400 text-white border-transparent",
    danger: "bg-red-500 hover:bg-red-600 dark:hover:bg-red-400 text-white border-transparent",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border-transparent",
    outline: "bg-transparent border-[var(--card-border)] text-[var(--text-primary)] hover:bg-[var(--card-background)] hover:border-[var(--primary)]",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </span>
    </button>
  );
}