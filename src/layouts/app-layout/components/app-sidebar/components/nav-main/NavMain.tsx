import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

type Props = {
  items: {
    name: string;
    slug: string;
    icon: LucideIcon;
  }[];
};
const NavMain = ({ items }: Props) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className={
                lastSegment === item.slug
                  ? "bg-primary-light text-primary hover:bg-primary-light hover:text-primary"
                  : "hover:bg-muted"
              }
            >
              <Link to={`/${item.slug}`}>
                <item.icon />
                <span className="font-medium">{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
