interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

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

interface FormInputProps {
  register: any;
  id: string;
  placeholder?: string;
  type?: string;
  error?: string;
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
        className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface FormSelectProps {
  register: any;
  id: string;
  options: Array<{ id: string; name: string }>;
  error?: string;
}

export function FormSelect({ register, id, options, error }: FormSelectProps) {
  return (
    <div>
      <select
        {...register}
        id={id}
        className="w-full p-2 border border-[var(--card-border)] rounded-lg bg-[var(--background)]"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
