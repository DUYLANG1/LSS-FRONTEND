import { ReactNode, forwardRef } from "react";

interface BaseFormProps {
  id: string;
  name: string;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
  title?: string; // Add title prop for tooltip functionality
}

interface FormInputProps extends BaseFormProps {
  type?: string;
  placeholder?: string;
}

interface FormSelectProps extends BaseFormProps {
  options: Array<{ id: string; name: string }>;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { id, name, type = "text", placeholder, required, className, ...props },
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
        className={`w-full p-2 border rounded-lg border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] 
          placeholder:text-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
          focus:border-transparent transition-all duration-200 ${
            className || ""
          }`}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, name, options, required, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        id={id}
        name={name}
        required={required}
        className={`w-full p-2 border rounded-lg border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)]
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent 
          transition-all duration-200 appearance-none cursor-pointer ${
            className || ""
          }`}
        {...props}
      >
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

interface FormTextAreaProps extends BaseFormProps {
  placeholder?: string;
  rows?: number;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ id, name, placeholder, rows = 4, required, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
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

export function FormLabel({ htmlFor, children, className, title }: FormLabelProps) {
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
