import { getCurrentUser } from "@/lib/auth/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
  await getCurrentUser();

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-(--text-primary)">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-(--text-muted)">
          Manage your account settings and preferences.
        </p>
      </header>
      <div className="bg-glass rounded-2xl border border-(--border-strong) p-4 sm:p-6 min-w-0 overflow-x-auto">
        <AccountSettings fullPage />
      </div>
    </div>
  );
}
