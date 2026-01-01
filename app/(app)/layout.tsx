import "@/styles/theme.css";
import AppShell from "@/components/clients/app-shell-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        min-h-screen
        bg-[rgb(var(--surface-app))]
        text-[rgb(var(--text-primary))]
        antialiased
      "
    >
      <AppShell>{children}</AppShell>
    </div>
  );
}
