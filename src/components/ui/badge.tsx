import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
        secondary:
          "bg-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-border)]/80",
        success:
          "bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]",
        warning:
          "bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]",
        error:
          "bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)]",
        info:
          "bg-[var(--info-bg)] text-[var(--info-text)] border border-[var(--info-border)]",
        outline:
          "text-[var(--text-primary)] border border-[var(--card-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onClose?: () => void;
}

function Badge({
  className,
  variant,
  onClose,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 rounded-full hover:bg-[var(--card-border)]/20 p-0.5"
          aria-label="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };