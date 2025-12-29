import AppShellClient from "@/components/clients/app-shell-client";
import TopNavBarServer from "@/components/layout/top-navbar-server";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavBarServer />
      <AppShellClient>{children}</AppShellClient>
    </>
  );
}
