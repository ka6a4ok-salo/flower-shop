import { requireAuth } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </main>
    </div>
  );
}
