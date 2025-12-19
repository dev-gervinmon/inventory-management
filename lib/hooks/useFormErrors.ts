import { useState, useCallback } from "react";
import { FieldError } from "@/lib/utils/form-validation";

export function useFormErrors() {
  const [errors, setErrors] = useState<FieldError>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  const setAllErrors = useCallback((newErrors: FieldError) => {
    setErrors(newErrors);
  }, []);

  const getFieldError = useCallback(
    (fieldName: string): string => errors[fieldName] || "",
    [errors]
  );

  const hasError = useCallback(
    (fieldName: string): boolean => !!errors[fieldName],
    [errors]
  );

  return {
    errors,
    clearErrors,
    clearFieldError,
    setFieldError,
    setAllErrors,
    getFieldError,
    hasError,
  };
}
