import { setRequestLocale } from "next-intl/server";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "@/lib/i18n/navigation";
import { isAdmin } from "@/server-actions/admin";
import { BaseLayoutProps } from "@/types/page-props";

const AdminLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user is admin
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) redirect({ href: "/", locale });

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="h-screen flex flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/6 bg-background/60 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Admin Panel
            </span>
          </div>
        </header>
        <ScrollArea className="flex-1 min-h-0">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
