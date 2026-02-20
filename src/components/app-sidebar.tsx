"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FileText, MessageCircleWarning, Monitor, MapPin, Image, LogOut
} from "lucide-react";
import type { Route } from "./nav-main";
import DashboardNavigation from "./nav-main";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const dashboardRoutes: Route[] = [
  {
    id: "report",
    title: "Report",
    icon: <FileText className="size-4" />,
    link: "/report",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const router = useRouter();

  function handleLogout() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpiry');

    // Redirect to login
    router.push('/login');
  }

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="[&_div[data-sidebar='sidebar']]:bg-white/85 [&_div[data-sidebar='sidebar']]:backdrop-blur-xl [&_div[data-sidebar='sidebar']]:border-white/20 [&_div[data-sidebar='sidebar']]:shadow-xl [&_div[data-sidebar='sidebar']]:shadow-black/5 dark:[&_div[data-sidebar='sidebar']]:bg-gray-900/85 dark:[&_div[data-sidebar='sidebar']]:border-white/10"
    >
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="/banner" className="flex items-center gap-2">
          <MessageCircleWarning className="h-8 w-8"/>
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Notification Management
            </span>
          )}
        </a>
        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-white/10">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted",
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
