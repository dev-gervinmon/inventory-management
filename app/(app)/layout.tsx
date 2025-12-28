import AppShellClient from "@/components/clients/app-shell-client";
import TopNavBar from "@/components/layout/top-navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavBar />
      <AppShellClient>{children}</AppShellClient>
    </>
  );
}
