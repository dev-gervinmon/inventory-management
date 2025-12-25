"use client";

import { useRef, useEffect, useState } from "react";
import FormButton from "@/components/buttons/form-button";
import Link from "next/link";

interface StickyFormHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  isLoading?: boolean;
  isDirty?: boolean;
  submitLabel?: string;
  alwaysShowReset?: boolean;
  onReset?: () => void;
}

export default function StickyFormHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  isLoading = false,
  isDirty = false,
  submitLabel = "Save changes",
  alwaysShowReset = false,
  onReset,
}: StickyFormHeaderProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Check if screen is large on mount
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const form = document.querySelector("form");
    formRef.current = form;

    const handleScroll = () => {
      if (!formRef.current || !isLargeScreen) return;

      const formTop = formRef.current.getBoundingClientRect().top;
      const headerHeight = 80;

      if (formTop <= headerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLargeScreen]);

  const handleSubmit = () => {
    formRef.current?.requestSubmit();
  };

  // Mobile/Tablet layout (non-sticky)
  if (!isLargeScreen) {
    return (
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 sm:mb-4">
          <Link
            href={backHref}
            className="inline-flex items-center px-2 py-3 text-gray-600 hover:text-gray-900 hover:underline transition-colors cursor-pointer w-fit font-semibold rounded-lg"
          >
            {backLabel || "Back"}
          </Link>
        </div>

        <div className="mb-4 sm:mb-6 px-4 sm:px-6 md:px-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-4 sm:px-6 md:px-0">
          <FormButton
            type="submit"
            label={submitLabel}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleSubmit}
          />
          {onReset && (
            <FormButton
              type="button"
              label="Reset"
              variant="secondary"
              size="md"
              disabled={alwaysShowReset ? isLoading : !isDirty || isLoading}
              onClick={onReset}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop/Large screen layout (with sticky behavior)
  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-20 border-b border-gray-200 bg-white shadow-md"
          : ""
      } transition-all duration-200`}
    >
      <div
        className={`${
          isSticky
            ? "md:ml-64 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-4"
            : "mb-6 sm:mb-8 md:mb-8 px-4 sm:px-6 md:px-0"
        }`}
      >
        {isSticky ? (
          <div className="flex items-center justify-between gap-3">
            {/* Left Side: Back button and title */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Link
                href={backHref}
                className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:underline transition-colors cursor-pointer w-fit shrink-0 font-semibold whitespace-nowrap rounded-lg"
              >
                ← Back
              </Link>
              <h1 className="font-bold text-gray-900 text-base truncate">
                {title}
              </h1>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <FormButton
                type="submit"
                label={
                  isLoading
                    ? `${submitLabel.replace("changes", "").trim()}...`
                    : submitLabel
                }
                variant="primary"
                size="sm"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleSubmit}
              />
              {onReset && (
                <FormButton
                  type="button"
                  label="Reset"
                  variant="secondary"
                  size="sm"
                  disabled={alwaysShowReset ? isLoading : !isDirty || isLoading}
                  onClick={onReset}
                />
              )}
            </div>
          </div>
        ) : (
          // When not sticky on large screen, show full header
          <div className="space-y-3 sm:space-y-4">
            {/* Back Button */}
            <div className="mb-2 sm:mb-3">
              <Link
                href={backHref}
                className="inline-flex items-center px-6 py-3 text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors cursor-pointer w-fit font-semibold rounded-lg"
              >
                {backLabel || "Back"}
              </Link>
            </div>

            {/* Title and Subtitle */}
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <FormButton
                type="submit"
                label={submitLabel}
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleSubmit}
              />
              {onReset && (
                <FormButton
                  type="button"
                  label="Reset"
                  variant="secondary"
                  size="md"
                  disabled={alwaysShowReset ? isLoading : !isDirty || isLoading}
                  onClick={onReset}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
