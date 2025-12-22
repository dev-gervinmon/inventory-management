/**
 * Base Skeleton Component
 * Reusable animated loading placeholder
 */
interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular";
}

export function Skeleton({
  className = "",
  variant = "default",
}: SkeletonProps) {
  const baseClasses = variant === "circular" ? "rounded-full" : "rounded";

  return (
    <div
      className={`animate-pulse bg-gray-200 ${baseClasses} ${className}`}
      aria-hidden="true"
    />
  );
}
