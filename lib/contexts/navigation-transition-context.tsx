"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useTransition,
  ReactElement,
} from "react";
import { useRouter } from "next/navigation";

interface NavigationTransitionContextType {
  isNavigating: boolean;
  push: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
}

const NavigationTransitionContext = createContext<
  NavigationTransitionContextType | undefined
>(undefined);

export function NavigationTransitionProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
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

  return (
    <NavigationTransitionContext.Provider
      value={{
        isNavigating: isPending,
        push,
        back,
        forward,
        refresh,
      }}
    >
      {children}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationTransition must be used within NavigationTransitionProvider"
    );
  }
  return context;
}
