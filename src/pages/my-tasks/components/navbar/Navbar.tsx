import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GroupIcon, PlusIcon, RotateCcw, RotateCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ViewID } from "./models/navbarModel";
import { views } from "@/constants/view";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import {
  createTask,
  setKanbanGroupBy,
  setTableGroupBy,
} from "@/features/task/taskSlice";
import { GROUP_BY_PRIORITY, GROUP_BY_STATUS } from "@/constants/task";
import { TaskPayload, ViewGroupBy } from "@/features/task/taskModel";
import { redoAction, undoAction } from "@/store/reducers/history";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import CreateUpdateTaskModal from "../create-task-modal/CreateUpdateTaskModal";

const Navbar = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const viewIDParams = queryParams.get("view");

  const validView = views.findIndex((v) => v.id === viewIDParams) !== -1;

  const activeViewID: ViewID = validView ? (viewIDParams as ViewID) : "table";

  const dispatch = useDispatch();

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const {
    tableView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const { past: pastState, future: futureState } = useAppSelector(
    (state) => state.taskState
  );

  const getActiveClass = (viewID: ViewID) => {
    if (viewID === activeViewID) {
      return "border-b-2 border-foreground";
    }
    return "text-muted-foreground";
  };

  const handleSetGroupBy = (groupBy: ViewGroupBy, checked: boolean) => {
    const groupByValue = checked ? groupBy : undefined;

    if (activeViewID === "table") {
      dispatch(setTableGroupBy(groupByValue));
    } else {
      dispatch(setKanbanGroupBy(groupByValue));
    }
  };

  const handleTaskCreate = (taskPayload: TaskPayload) => {
    dispatch(createTask(taskPayload));
    setIsCreateTaskModalOpen(false);
  };

  return (
    <nav aria-label="My task navbar" className="bg-background border-b px-4">
      <div className="flex justify-between items-center pt-4 pb-2">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <h3 className="font-medium">My Tasks</h3>
        </div>
        <Button onClick={() => setIsCreateTaskModalOpen(true)} className="px-5">
          New task
          <PlusIcon />
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-5 text-[15px]">
          {views.map((view) => (
            <Link key={view.id} to={`/my-tasks?view=${view.id}`}>
              <div
                className={cn(
                  "flex items-center gap-1 py-2 cursor-pointer",
                  getActiveClass(view.id)
                )}
              >
                <view.icon size={13} className="mb-1" />
                <span className="font-medium">{view.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-10">
          <div className="flex gap-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RotateCcw
                    onClick={() => dispatch(undoAction)}
                    size={20}
                    className={cn(
                      "cursor-pointer",
                      pastState.length > 0 ? "" : "opacity-50"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo last action</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RotateCw
                    onClick={() => dispatch(redoAction)}
                    size={20}
                    className={cn(
                      "cursor-pointer",
                      futureState.length > 0 ? "" : "opacity-50"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo last action</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer">
                <GroupIcon size={13} className="mb-1" />
                <span className="font-medium capitalize">
                  Group By{groupBy ? `: ${groupBy}` : ""}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem
                checked={groupBy === GROUP_BY_STATUS}
                onCheckedChange={(checked) =>
                  handleSetGroupBy(GROUP_BY_STATUS, checked)
                }
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={groupBy === GROUP_BY_PRIORITY}
                onCheckedChange={(checked) =>
                  handleSetGroupBy(GROUP_BY_PRIORITY, checked)
                }
              >
                Priority
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isCreateTaskModalOpen && (
        <CreateUpdateTaskModal
          isOpen={isCreateTaskModalOpen}
          onSubmit={handleTaskCreate}
          onClose={() => setIsCreateTaskModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
