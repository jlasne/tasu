import AppSidebar from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream dark:bg-dark-bg">
      <AppSidebar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
