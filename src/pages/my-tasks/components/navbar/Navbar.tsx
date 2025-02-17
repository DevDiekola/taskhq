import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FilterIcon, Share2Icon, SortAscIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ViewID, views } from "./models/navbarModel";

const Navbar = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const activeViewID = queryParams.get("view");

  const getActiveClass = (viewID: ViewID) => {
    if (viewID === activeViewID) {
      return "border-b-2 border-foreground";
    }
    return "text-muted-foreground";
  };

  return (
    <nav aria-label="My task navbar" className="bg-background border-b px-4">
      <div className="flex justify-between items-center pt-4 pb-2">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <h3 className="font-medium">My Tasks</h3>
        </div>

        <Button className="w-[100px] h-[35px]">
          <Share2Icon size={13} className="mr-2" />
          Share
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-5 text-[15px]">
          {views.map((view) => (
            <Link key={view.id} to={`/my-tasks?view=${view.id}`}>
              <div
                className={`flex items-center gap-1 py-2 cursor-pointer ${getActiveClass(
                  view.id
                )}`}
              >
                <view.icon size={13} className="mb-1" />
                <span className="font-medium">{view.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex gap-5 text-[15px]">
          <Input
            className="h-9 w-[250px] bg-muted"
            placeholder="Search tasks"
          />
          <div className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer">
            <FilterIcon size={13} className="mb-1" />
            <span className="font-medium">Filter</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer">
            <SortAscIcon size={13} className="mb-1" />
            <span className="font-medium">Sort</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
