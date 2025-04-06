import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  error?: string;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className, rows = 4, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full p-2 border rounded-md border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)]",
            "placeholder:text-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
            "focus:border-transparent transition-all duration-200 resize-y",
            error && "border-[var(--error-border)] focus:ring-[var(--error-text)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--error-text)]">{error}</p>
        )}
      </div>
    );
  }
);

FormTextArea.displayName = "FormTextArea";