import { setRequestLocale } from "next-intl/server";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { BaseLayoutProps } from "@/types/page-props";
import { isAdmin } from "@/server-actions/admin";
import { redirect } from "@/lib/i18n/navigation";

const AdminLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user is admin
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) redirect({ href: "/", locale });

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium">Admin Panel</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
