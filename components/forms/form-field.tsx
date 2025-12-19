"use client";

import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        <span>{label}</span>
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className={error ? "relative" : ""}>
        <div className={`${error ? "has-error" : ""}`}>{children}</div>

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}

      {!error && hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
