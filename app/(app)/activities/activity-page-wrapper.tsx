"use client";

import { ReactNode } from "react";

interface ActivityPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Activity Page
 * Provides consistent layout structure
 */
export default function ActivityPageWrapper({
  children,
}: ActivityPageWrapperProps) {
  return <>{children}</>;
}
