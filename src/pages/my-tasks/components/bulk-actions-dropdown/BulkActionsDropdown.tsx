import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import { TaskPriority, TaskStatus } from "@/features/task/taskModel";
import { toTitleCase } from "@/utils/string";
import { BarChartIcon, Trash2Icon } from "lucide-react";
import React from "react";

type Props = {
  taskIDs: number[];
  onSetStatus: (status: TaskStatus) => void;
  onSetPriority: (priority: TaskPriority) => void;
  onBulkDelete: (taskIDs: number[]) => void;
  children: React.ReactNode;
};

const BulkActionsDropdown: React.FC<Props> = ({
  taskIDs,
  onSetStatus,
  onSetPriority,
  onBulkDelete,
  children,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={taskIDs.length === 0} asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <BarChartIcon />
              <span>Set status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {TASK_STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onSetStatus(status)}
                  >
                    {toTitleCase(status)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <BarChartIcon />
              <span>Set priority</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {TASK_PRIORITIES.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => onSetPriority(priority)}
                  >
                    {toTitleCase(priority)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onBulkDelete(taskIDs)}
          className="text-red-500"
        >
          <Trash2Icon />
          <span>Bulk delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkActionsDropdown;
