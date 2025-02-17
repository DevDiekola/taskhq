import AppSidebar from "@/components/app-sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
        <Outlet />
      </SidebarInset> */}
    </SidebarProvider>
  );
};

export default AppLayout;
