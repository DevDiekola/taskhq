import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDownIcon, PlusIcon, RotateCcw, RotateCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ViewID } from "./models/navbarModel";
import { views } from "@/constants/view";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { createTask, seedTasks } from "@/features/task/taskSlice";
import { TaskPayload } from "@/features/task/taskModel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import CreateUpdateTaskModal from "../create-task-modal/CreateUpdateTaskModal";
import TableGroupBy from "./table-group-by/TableGroupBy";
import KanbanGroupBy from "./kanban-group-by/KanbanGroupBy";
import SeedTaskModal from "../seed-task-modal/SeedTaskModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MOCK_TASKS,
  REDO_TASK_ACTION,
  UNDO_TASK_ACTION,
} from "@/constants/task";

const TaskNavbar = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const viewIDParams = queryParams.get("view");

  const validView = views.findIndex((v) => v.id === viewIDParams) !== -1;

  const activeViewID: ViewID = validView ? (viewIDParams as ViewID) : "table";

  const dispatch = useDispatch();

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const [isSeedTaskModalOpen, setIsSeedTaskModalOpen] = useState(false);
  const [seedCount, setSeedCount] = useState(0);

  const {
    past: pastState,
    present: { tasks },
    future: futureState,
  } = useAppSelector((state) => state.taskState);

  const getActiveClass = (viewID: ViewID) => {
    if (viewID === activeViewID) {
      return "border-b-2 border-foreground";
    }
    return "text-muted-foreground";
  };

  const handleTaskCreate = (taskPayload: TaskPayload) => {
    dispatch(createTask(taskPayload));
    setIsCreateTaskModalOpen(false);
  };

  const handleTaskSeed = (count: number) => {
    dispatch(seedTasks(count));
    setIsSeedTaskModalOpen(false);
  };

  const handleTaskSeedClick = (count: number) => {
    if (tasks.length > 0) {
      setSeedCount(count);
      setIsSeedTaskModalOpen(true);
      return;
    }
    dispatch(seedTasks(count));
  };

  return (
    <nav aria-label="My task navbar" className="bg-background border-b px-4">
      <div className="flex justify-between items-center pt-4 pb-2">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <h3 className="font-medium">My Tasks</h3>
        </div>
        <div className="flex gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-5">
                <span>Seed tasks</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52">
              {[10, 20, 50, MOCK_TASKS.length].map((count) => (
                <DropdownMenuItem
                  key={count}
                  onClick={() => handleTaskSeedClick(count)}
                >
                  {count}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="px-5"
          >
            <span>New task</span>
            <PlusIcon />
          </Button>
        </div>
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
                    onClick={() => dispatch(UNDO_TASK_ACTION)}
                    size={20}
                    className={cn(
                      "cursor-pointer",
                      pastState.length === 0 && "opacity-50"
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
                    onClick={() => dispatch(REDO_TASK_ACTION)}
                    size={20}
                    className={cn(
                      "cursor-pointer",
                      futureState.length === 0 && "opacity-50"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo last action</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {activeViewID === "table" ? <TableGroupBy /> : <KanbanGroupBy />}
        </div>
      </div>
      {isCreateTaskModalOpen && (
        <CreateUpdateTaskModal
          isOpen={isCreateTaskModalOpen}
          onSubmit={handleTaskCreate}
          onClose={() => setIsCreateTaskModalOpen(false)}
        />
      )}
      {isSeedTaskModalOpen && (
        <SeedTaskModal
          isOpen={isSeedTaskModalOpen}
          seedCount={seedCount}
          onSeed={handleTaskSeed}
          onClose={() => setIsSeedTaskModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default TaskNavbar;
