import Sidebar from "@/components/layout/sidebar-unified";
import TopNavBar from "../layout/top-nav/top-nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />

      <div className="grid lg:grid-cols-[auto_1fr]">
        <Sidebar />

        <main className="px-4 sm:px-6 md:px-8 py-4 mt-16">{children}</main>
      </div>
    </div>
  );
}
