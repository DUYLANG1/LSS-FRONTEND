import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "@/components/ui/Input";
import { Select, SelectProps } from "@/components/ui/Select";

// Form component
const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn("space-y-4", className)}
    {...props}
  />
));
Form.displayName = "Form";

// FormField component
interface FormFieldProps {
  id: string;
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps
>(({ id, label, tooltip, children, className, required = false, error }, ref) => (
  <div ref={ref} className={cn("relative group space-y-2", className)}>
    <FormLabel htmlFor={id} title={tooltip}>
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
));
FormField.displayName = "FormField";

// FormLabel component
interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  FormLabelProps
>(({ htmlFor, children, className, title }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={cn(
      "block text-[var(--text-primary)] font-medium",
      className
    )}
    title={title}
  >
    {children}
  </label>
));
FormLabel.displayName = "FormLabel";

// FormInput component
interface FormInputProps extends Omit<InputProps, 'id'> {
  id: string;
  name: string;
  minLength?: number;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={className}
      {...props}
    />
  )
);
FormInput.displayName = "FormInput";

// FormSelect component
interface FormSelectProps extends Omit<SelectProps, "id" | "options"> {
  id: string;
  name: string;
  options: Array<{ id: string; name: string }>;
  children?: React.ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
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

// FormTextArea component
interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  error?: string;
}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className, rows = 4, error, ...props }, ref) => (
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
  )
);
FormTextArea.displayName = "FormTextArea";

export {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextArea,
  type FormFieldProps,
  type FormLabelProps,
  type FormInputProps,
  type FormSelectProps,
  type FormTextAreaProps,
};