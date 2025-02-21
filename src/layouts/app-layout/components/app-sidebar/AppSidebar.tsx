import {
  ChartColumnIncreasingIcon,
  HomeIcon,
  InboxIcon,
  ListTodoIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavWorkspace from "./components/nav-workspace/NavWorkspace";
import NavMain from "./components/nav-main/NavMain";
import NavUser from "./components/nav-user/NavUser";

const navMain = [
  {
    name: "Home",
    slug: "#",
    icon: HomeIcon,
    isDisabled: true,
  },
  {
    name: "My tasks",
    slug: "my-tasks",
    icon: ListTodoIcon,
    isDisabled: false,
  },
  {
    name: "Inbox",
    slug: "#",
    icon: InboxIcon,
    isDisabled: true,
  },
  {
    name: "Dashboards",
    slug: "#",
    icon: ChartColumnIncreasingIcon,
    isDisabled: true,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavWorkspace />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
