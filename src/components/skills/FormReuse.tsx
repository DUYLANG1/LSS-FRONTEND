import { ReactNode } from "react";

interface BaseFormProps {
  id: string;
  error?: string;
  register: any; // Consider using proper type from react-hook-form
}

interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
}

interface FormInputProps extends BaseFormProps {
  placeholder?: string;
  type?: string;
}

interface FormSelectProps extends BaseFormProps {
  options: Array<{ id: string; name: string }>;
}

const baseInputStyles =
  "w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]";
const errorStyles = "mt-1 text-sm text-red-600";

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

export function FormInput({
  register,
  id,
  placeholder,
  type = "text",
  error,
}: FormInputProps) {
  return (
    <div>
      <input
        {...register}
        type={type}
        id={id}
        placeholder={placeholder}
        className={baseInputStyles}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
}

export function FormSelect({ register, id, options, error }: FormSelectProps) {
  return (
    <div>
      <select {...register} id={id} className={baseInputStyles}>
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
