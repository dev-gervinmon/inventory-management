"use client";

import { useRef, useEffect, useState } from "react";
import FormButton from "@/components/buttons/form-button";
import { ChevronLeft } from "lucide-react";

interface StickyFormHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  isLoading?: boolean;
  isDirty?: boolean;
  onReset?: () => void;
  onBack?: (href: string) => void;
}

export default function StickyFormHeader({
  title,
  subtitle,
  backHref,
  isLoading = false,
  isDirty = false,
  onReset,
  onBack,
}: StickyFormHeaderProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const form = document.querySelector("form");
    formRef.current = form;

    const handleScroll = () => {
      if (!formRef.current) return;

      const formTop = formRef.current.getBoundingClientRect().top;
      const headerHeight = 80; // Height of sticky header

      if (formTop <= headerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-20 border-b border-gray-200 bg-white shadow-md"
          : ""
      } transition-all duration-200`}
    >
      <div className={`${isSticky ? "ml-64 px-8 py-4" : "mb-8"}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Left Side: Title & Subtitle */}
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              onClick={() =>
                onBack ? onBack(backHref) : (window.location.href = backHref)
              }
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1
                className={`font-bold text-gray-900 ${
                  isSticky ? "text-lg" : "text-3xl"
                }`}
              >
                {title}
              </h1>
              {subtitle && !isSticky && (
                <p className="text-base text-gray-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-3">
            {isDirty && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Reset
              </button>
            )}
            <FormButton
              type="submit"
              label="Save changes"
              variant="primary"
              size={isSticky ? "sm" : "lg"}
              disabled={isLoading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
