import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "@/components/ui/Input";

export interface FormInputProps extends Omit<InputProps, 'id'> {
  id: string;
  name: string;
  minLength?: number;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";