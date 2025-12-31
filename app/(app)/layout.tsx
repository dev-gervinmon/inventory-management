import "@/styles/theme.css";
import AppShellClient from "@/components/clients/app-shell-client";
import TopNavBarServer from "@/components/layout/top-navbar-server";

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
      <TopNavBarServer />
      <AppShellClient>{children}</AppShellClient>
    </div>
  );
}
