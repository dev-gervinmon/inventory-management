import { createContext, useContext } from "react";
import { FieldError } from "@/lib/utils/form-validation";

interface ProductFormContextType {
  formErrors: FieldError;
  isSubmitting: boolean;
}

export const ProductFormContext = createContext<
  ProductFormContextType | undefined
>(undefined);

export function useProductFormContext() {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error(
      "useProductFormContext must be used within ProductEditClient"
    );
  }
  return context;
}
