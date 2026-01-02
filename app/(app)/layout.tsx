import "@/styles/theme.css";
import AppShell from "@/components/clients/app-shell-client";
import TopNavBar from "@/components/layout/top-nav/top-nav";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-context";

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
      <SidebarProvider>
        <TopNavBar />
        <AppShell>{children}</AppShell>
      </SidebarProvider>
    </div>
  );
}
