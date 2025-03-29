import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  validate: (value: T[keyof T]) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

export function useFormValidation<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback((rules: ValidationRules<T>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const key = field as keyof T;
      const value = values[key];

      if (fieldRules) {
        for (const rule of fieldRules) {
          if (!rule.validate(value)) {
            newErrors[key] = rule.message;
            isValid = false;
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    validate,
    reset,
    setValues,
  };
}