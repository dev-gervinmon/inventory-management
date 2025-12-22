"use client";

import Link from "next/link";
import FormButton from "@/components/buttons/form-button";
import { PageError } from "@/components/common/error-state";
import { useRouter } from "next/navigation";

interface ClientErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Client-side Error Component
 * Displayed when errors occur in Client Components
 * Provides retry and navigation options with support link
 */
export default function ClientError({ error, reset }: ClientErrorProps) {
  const router = useRouter();

  return (
    <PageError
      message="We apologize, but something unexpected happened. Please try refreshing the page. If the problem persists, please contact our support team."
      onRetry={() => {
        reset();
        router.refresh();
      }}
      actionButton={
        <div className="flex flex-col gap-4">
          <FormButton
            type="button"
            label="Try Again"
            variant="delete"
            size="md"
            onClick={() => {
              reset();
              router.refresh();
            }}
            className="w-full justify-center"
          />
          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors border-b border-transparent hover:border-gray-900"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Support
          </Link>
        </div>
      }
    />
  );
}
