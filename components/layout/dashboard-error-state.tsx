"use client";

import FormButton from "@/components/buttons/form-button";
import { ErrorState } from "@/components/common/error-state";
import MobileSidebar from "@/components/layout/mobile-sidebar";

interface DashboardErrorStateProps {
  message?: string;
}

/**
 * Client Component wrapper for dashboard error state
 * Handles the retry button click which requires client-side interaction
 */
export default function DashboardErrorState({
  message = "We're having trouble loading your dashboard at the moment. Please try again.",
}: DashboardErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar currentPath="/dashboard" />
      <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-8 pt-20 sm:pt-24 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Dashboard
        </h1>
        <ErrorState
          title="Unable to Load Dashboard"
          message={message}
          actionButton={
            <FormButton
              type="button"
              label="Try Again"
              variant="delete"
              size="sm"
              onClick={() => {
                window.location.reload();
              }}
            />
          }
        />
      </main>
    </div>
  );
}
