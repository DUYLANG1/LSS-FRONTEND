import { ReactNode, forwardRef } from "react";

interface BaseFormProps {
  id: string;
  error?: string;
  name: string;
}

interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
}

interface FormInputProps extends BaseFormProps {
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}

interface FormSelectProps extends BaseFormProps {
  options: Array<{ id: string; name: string }>;
  defaultValue?: string;
}

const baseInputStyles =
  "w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent";
const errorStyles = "mt-1 text-sm text-red-600 dark:text-red-400";

export function FormLabel({ htmlFor, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[var(--text-primary)] font-medium mb-1"
    >
      {children}
    </label>
  );
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, name, placeholder, type = "text", error, defaultValue }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={baseInputStyles}
        />
        {error && <p className={errorStyles}>{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, name, options, error, defaultValue }, ref) => {
    return (
      <div>
        <select
          ref={ref}
          id={id}
          name={name}
          defaultValue={defaultValue}
          className={baseInputStyles}
        >
          {options.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        {error && <p className={errorStyles}>{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";
