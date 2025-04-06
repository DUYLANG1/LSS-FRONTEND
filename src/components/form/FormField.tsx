import React, { ReactNode } from "react";
import { FormLabel } from "./FormLabel";

export interface FormFieldProps {
  id: string;
  label: string;
  tooltip?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

export function FormField({
  id,
  label,
  tooltip,
  children,
  className,
  required = false,
  error,
}: FormFieldProps) {
  return (
    <div className={`relative group space-y-2 ${className || ""}`}>
      <FormLabel 
        htmlFor={id} 
        title={tooltip}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </FormLabel>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-[var(--error-text)]">{error}</p>
      )}
      
      {tooltip && (
        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
}