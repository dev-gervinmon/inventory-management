"use client";

import QuickActionButton from "@/components/buttons/quick-action-button";

/**
 * Not Found Error Page
 * Displays a user-friendly 404 message with home link
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 max-w-md w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <QuickActionButton
          href="/"
          label="Go Back Home"
          icon={
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
                d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0m0 0l4.5-4.5m0 0l4.5 4.5"
              />
            </svg>
          }
          variant="primary"
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}
