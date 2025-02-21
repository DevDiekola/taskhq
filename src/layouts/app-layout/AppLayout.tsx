import AppSidebar from "@/layouts/app-layout/components/app-sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AppLayout = () => {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
};

export default AppLayout;
