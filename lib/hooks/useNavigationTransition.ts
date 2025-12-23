"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Custom hook for managing navigation transitions
 * Tracks when navigation is in progress to enable loading UI
 *
 * @returns Object with navigation methods and loading state
 */
export function useNavigationTransitionHook() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const back = () => {
    startTransition(() => {
      router.back();
    });
  };

  const forward = () => {
    startTransition(() => {
      router.forward();
    });
  };

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return {
    push,
    back,
    forward,
    refresh,
    isNavigating: isPending,
  };
}
