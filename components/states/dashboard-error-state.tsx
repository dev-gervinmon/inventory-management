"use client";

import FormButton from "@/components/buttons/form-button";
import { ErrorState } from "@/components/common/error-state";
import PageLayout from "@/components/layout/page-layout";

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
    <PageLayout currentPath="/dashboard">
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
    </PageLayout>
  );
}
