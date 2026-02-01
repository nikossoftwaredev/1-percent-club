"use client";

import { Users, Globe, LayoutDashboard, Crown } from "lucide-react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Countries",
    href: "/admin/countries",
    icon: Globe,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-white/6">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <Crown className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-wide golden-shimmer">1% CLUB</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
