"use client";

import { useSyncExternalStore } from "react";
import { UserButton } from "@stackframe/stack";
import { Skeleton } from "@/components/skeletons/skeleton";

export default function UserButtonClientOnly() {
  // Avoid setState in an effect (which can cause cascading renders in dev).
  // During SSR/hydration, this returns false, then becomes true on the client.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return <UserButton />;
}
