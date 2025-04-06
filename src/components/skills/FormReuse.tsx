import React, { ReactNode, forwardRef } from "react";

export interface BaseFormProps {
  id: string;
  name: string;
  className?: string;
  required?: boolean;
}

export interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
  title?: string; // Add title prop for tooltip functionality
}

interface FormInputProps extends BaseFormProps {
  type?: string;
  placeholder?: string;
  minLength?: number;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface FormSelectProps extends BaseFormProps {
  options: Array<{ id: string; name: string }>;
  children?: ReactNode;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

interface FormTextAreaProps extends BaseFormProps {
  placeholder?: string;
  rows?: number;
  minLength?: number;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export interface FormFieldWrapperProps {
  htmlFor: string;
  label: string;
  tooltip: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

// Add a utility function at the top of the file
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Then use it in your components
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = "text",
      placeholder,
      required,
      className,
      minLength,
      defaultValue, // Add defaultValue to destructuring
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue} // Use the defaultValue prop
        className={cn(
          "w-full p-2 border rounded-lg border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)]",
          "placeholder:text-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
          "focus:border-transparent transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      id,
      name,
      options,
      required,
      className,
      children,
      defaultValue,
      ...props
    },
    ref
  ) => {
    // Remove this comment about defaultValue destructuring
    return (
      <select
        ref={ref}
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue} // Use the defaultValue prop
        className={`w-full p-2 border rounded-lg border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)]
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent 
          transition-all duration-200 appearance-none cursor-pointer ${
            className || ""
          }`}
        {...props}
      >
        {children}
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
);

FormSelect.displayName = "FormSelect";

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      id,
      name,
      placeholder,
      rows = 4,
      required,
      className,
      minLength,
      defaultValue, // Add defaultValue to destructuring
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue} // Use the defaultValue prop
        className={`w-full p-2 border rounded-lg border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)]
          placeholder:text-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
          focus:border-transparent transition-all duration-200 resize-y ${
            className || ""
          }`}
        {...props}
      />
    );
  }
);

FormTextArea.displayName = "FormTextArea";

export function FormLabel({
  htmlFor,
  children,
  className,
  title,
}: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-[var(--text-primary)] font-medium mb-2 ${
        className || ""
      }`}
      title={title} // Add title attribute for native HTML tooltip
    >
      {children}
    </label>
  );
}

export function FormFieldWrapper({
  htmlFor,
  label,
  tooltip,
  children,
  className,
  required = false,
}: FormFieldWrapperProps) {
  return (
    <div className={`relative group ${className || ""}`}>
      <label
        htmlFor={htmlFor}
        className="block text-[var(--text-primary)] font-medium mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-10">
        {tooltip}
      </div>
    </div>
  );
}
