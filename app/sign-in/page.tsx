"use client";

import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-(--brand)/10 via-(--surface)/60 to-(--brand)/10 bg-noise bg-fixed">
      <div className="relative max-w-md w-full p-8 rounded-2xl shadow-2xl border border-(--border-subtle) bg-white/80 dark:bg-black/40 backdrop-blur-xl flex flex-col items-center space-y-8 animate-fade-in">
        {/* Logo and headline */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <img
            src="/logo1.svg"
            alt="InventoryApp Logo"
            className="w-14 h-14 mb-2 drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://placehold.co/56x56?text=Logo";
            }}
          />
          <h1 className="text-2xl font-bold text-(--brand) tracking-tight">
            Sign in to InventoryApp
          </h1>
          <p className="text-sm text-(--text-secondary) text-center max-w-xs">
            Access your dashboard, manage inventory, and unlock real-time
            insights.
          </p>
        </div>
        {/* Auth form */}
        <div className="w-full">
          <SignIn />
        </div>
        {/* Go back link */}
        <Link
          href="/"
          className="inline-block mt-2 text-sm font-medium text-(--brand) hover:underline hover:text-(--brand-dark) transition"
        >
          ← Go Back Home
        </Link>
        {/* Decorative glass highlight */}
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-linear-to-r from-(--brand)/20 via-white/40 to-(--brand)/20 blur-2xl opacity-60" />
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        .bg-noise {
          background-image: url('/noise.png');
          background-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}
