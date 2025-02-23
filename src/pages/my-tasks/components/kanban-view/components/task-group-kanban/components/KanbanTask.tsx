import { MoreHorizontalIcon } from "lucide-react";
import { Task, TaskGroupBy } from "@/features/task/taskModel";
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/utils/string";
import { getPriorityClassNames, getStatusClassNames } from "@/utils/color";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import TaskActionsDropdown from "@/pages/my-tasks/components/task-actions-dropdown/TaskActionsDropdown";
import IconButton from "@/components/icon-button/IconButton";

type Props = {
  task: Task;
  groupBy: TaskGroupBy;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (taskIDs: number | number[]) => void;
};

const KanbanTask: React.FC<Props> = ({
  task,
  groupBy,
  isChecked,
  onCheckedChange,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const groupClassNames =
    groupBy === "status"
      ? getPriorityClassNames(task.priority)
      : getStatusClassNames(task.status);

  return (
    <div className="bg-kanban border p-3 pb-5 rounded-md my-3 cursor-pointer">
      <div className="flex gap-3 items-start">
        {/* I'd have preferred to have this checkbox appear only when the task div is hovered (looks nicer imo) 
        but that impacts accessibility so I'm happy to live with that tradeoff */}
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          className={cn("mt-1")}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h5 className="text-base font-medium text-gray-800 dark:text-white">
              {task.title}
            </h5>
            <TaskActionsDropdown
              task={task}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            >
              <IconButton
                aria-label={`Task actions dropdown for ${task.title}`}
                className="p-1 hover:bg-muted"
              >
                <MoreHorizontalIcon
                  size={18}
                  className="text-muted-foreground"
                />
              </IconButton>
            </TaskActionsDropdown>
          </div>
          <Badge
            variant="outline"
            className={cn(Object.values(groupClassNames), "mt-3")}
          >
            {groupBy === "priority"
              ? toTitleCase(task.status)
              : toTitleCase(task.priority)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default KanbanTask;
