"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { SecondaryButton } from "@/components/buttons/nav-button";
import { UI_TIMING } from "@/lib/constants/forms";

export default function CategoryNotFound({
  categoryId,
}: {
  categoryId: string;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(
    UI_TIMING.DELETE_SUCCESS_MODAL_DELAY_MS / 1000
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if this category was recently deleted (read sessionStorage once)
  const wasDeleted = useMemo(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("deletedCategoryId") === categoryId;
  }, [categoryId]);

  useEffect(() => {
    // Clean up the sessionStorage after first render
    if (wasDeleted) {
      sessionStorage.removeItem("deletedCategoryId");
    }
  }, [wasDeleted]);

  useEffect(() => {
    // Only set up countdown if category was deleted
    if (!wasDeleted) return;

    // Countdown interval
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect timeout as fallback
    timeoutRef.current = setTimeout(() => {
      router.push("/categories");
    }, UI_TIMING.DELETE_SUCCESS_MODAL_DELAY_MS);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [wasDeleted, router]);

  // Separate effect to handle redirect when countdown reaches 0
  useEffect(() => {
    if (wasDeleted && countdown <= 0) {
      router.push("/categories");
    }
  }, [countdown, wasDeleted, router]);

  const handleClickRedirect = () => {
    if (wasDeleted) {
      // Clear the interval ref and timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      router.push("/categories");
    }
  };

  return (
    <div
      className={`flex min-h-screen bg-gray-50 ${
        wasDeleted ? "cursor-pointer" : ""
      }`}
      onClick={handleClickRedirect}
      role="button"
      tabIndex={wasDeleted ? 0 : -1}
    >
      <MobileSidebar currentPath="/categories" />
      <main className="flex-1 overflow-y-auto">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{wasDeleted ? "✅" : "🔍"}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {wasDeleted ? "Category Deleted" : "Category Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {wasDeleted
                ? "The category has been successfully deleted."
                : "This category does not exist or may have been deleted."}
            </p>
            {wasDeleted && (
              <p className="text-sm text-gray-500 mb-4">
                Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
              </p>
            )}
            {!wasDeleted && (
              <SecondaryButton href="/categories" label="Back to Categories" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
