import { AlertTriangle, RefreshCw } from "lucide-react";
import { ReactNode } from "react";
import FormButton from "@/components/buttons/form-button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
  children?: ReactNode;
  fullPage?: boolean;
  actionButton?: ReactNode; // Custom button component
}

/**
 * Reusable Error State Component
 * Displays error messages with retry button and icon
 * Mobile-responsive with flexible sizing
 *
 * @example
 * <ErrorState
 *   title="Failed to Load Data"
 *   message="An error occurred while fetching your products"
 *   onRetry={() => window.location.reload()}
 * />
 */
export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred. Please try again.",
  error,
  onRetry,
  retryLabel = "Try Again",
  icon = <AlertTriangle className="w-10 h-10 md:w-12 md:h-12" />,
  children,
  fullPage = false,
  actionButton,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : message;

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="text-red-600">{icon}</div>
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 text-center mb-2">
            {title}
          </h1>
          <p className="text-sm md:text-base text-gray-600 text-center mb-4">
            {errorMessage}
          </p>
          {children && <div className="mb-6">{children}</div>}
          {actionButton
            ? actionButton
            : onRetry && (
                <FormButton
                  type="button"
                  label={retryLabel}
                  variant="delete"
                  size="md"
                  onClick={onRetry}
                  className="w-full justify-center"
                />
              )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 text-red-600 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-semibold text-red-900 mb-1">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-red-800 mb-4">{errorMessage}</p>
          {children && <div className="mb-4">{children}</div>}
          {actionButton
            ? actionButton
            : onRetry && (
                <FormButton
                  type="button"
                  label={retryLabel}
                  variant="delete"
                  size="sm"
                  onClick={onRetry}
                />
              )}
        </div>
      </div>
    </div>
  );
}

/**
 * Error variants for specific use cases
 */

export function DataFetchError({
  onRetry,
  message = "Failed to load data. Please try again.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <ErrorState
      title="Failed to Load Data"
      message={message}
      onRetry={onRetry}
      retryLabel="Reload"
    />
  );
}

export function FormError({
  onRetry,
  message = "An error occurred while processing your request.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <ErrorState
      title="Error"
      message={message}
      onRetry={onRetry}
      retryLabel="Try Again"
    />
  );
}

export function PageError({
  onRetry,
  message = "An unexpected error occurred. Please try again.",
  actionButton,
}: {
  onRetry?: () => void;
  message?: string;
  actionButton?: ReactNode;
}) {
  return (
    <ErrorState
      title="Oops! Something went wrong"
      message={message}
      onRetry={onRetry}
      actionButton={actionButton}
      retryLabel="Go Back Home"
      fullPage
    />
  );
}
