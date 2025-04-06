import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

export function FormLabel({
  htmlFor,
  children,
  className,
  title,
}: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-[var(--text-primary)] font-medium",
        className
      )}
      title={title}
    >
      {children}
    </label>
  );
}