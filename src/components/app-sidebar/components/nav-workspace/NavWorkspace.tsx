import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/string";
import { useAppSelector } from "@/hooks/useAppSelector";

const NavWorkspace = () => {
  const { name, plan, logoURL } = useAppSelector(
    (state) => state.workspaceState.workspace
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="rounded-lg bg-primary size-9">
            <AvatarImage src={logoURL} alt={name} className="rounded-none" />
            <AvatarFallback className="text-[15px] bg-transparent rounded-none text-sidebar-primary-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight ml-1">
            <span className="truncate text-[13px] font-semibold">{name}</span>
            <span className="truncate text-xs">{plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavWorkspace;
