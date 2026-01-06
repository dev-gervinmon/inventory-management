import { createContext, useContext } from "react";
import { FieldError } from "@/lib/utils/form-validation";

interface ProductFormContextType {
  formErrors: FieldError;
  isSubmitting: boolean;
  onSubmit?: (formData: FormData) => Promise<void>;
  clearFieldError?: (fieldName: string) => void;
  onFieldChange?: (fieldName: string, nextValue: string) => void;
}

export const ProductFormContext = createContext<
  ProductFormContextType | undefined
>(undefined);

export function useProductFormContext() {
  const context = useContext(ProductFormContext);
  if (!context) {
    // Return defaults if context is not available (fallback for development/testing)
    return {
      formErrors: {},
      isSubmitting: false,
      onSubmit: undefined,
      clearFieldError: undefined,
      onFieldChange: undefined,
    };
  }
  return context;
}
