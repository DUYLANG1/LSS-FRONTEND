import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
        secondary: "bg-[var(--card-background)] text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--card-border)]",
        outline: "border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-background)]",
        ghost: "hover:bg-[var(--card-border)] hover:text-[var(--text-primary)] bg-transparent",
        link: "text-[var(--primary)] underline-offset-4 hover:underline bg-transparent",
        danger: "bg-[var(--error-bg)] text-[var(--error-text)] hover:bg-[var(--error-border)]",
        success: "bg-[var(--success-bg)] text-[var(--success-text)] hover:bg-[var(--success-border)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };