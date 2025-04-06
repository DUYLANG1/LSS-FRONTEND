import React, { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectProps } from "@/components/ui/Select";

export interface FormSelectProps extends Omit<SelectProps, "id" | "options"> {
  id: string;
  name: string;
  options: Array<{ id: string; name: string }>;
  children?: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ options, children, ...props }, ref) => {
    // Transform options format from {id, name} to {value, label}
    const transformedOptions = options.map((option) => ({
      value: option.id,
      label: option.name,
    }));

    return (
      <Select ref={ref} options={transformedOptions} {...props}>
        {children}
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";
