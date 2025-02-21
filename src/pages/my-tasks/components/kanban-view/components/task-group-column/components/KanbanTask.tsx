import IconButton from "@/components/icon-button/IconButton";
import { MoreHorizontalIcon } from "lucide-react";
import { Task, ViewGroupBy } from "@/features/task/taskModel";
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/utils/string";
import { getPriorityClassNames, getStatusClassNames } from "@/utils/color";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import TaskActionsDropdown from "../../../../task-actions-dropdown/TaskActionsDropdown";

type Props = {
  task: Task;
  groupBy: ViewGroupBy;
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
  const fieldColors =
    groupBy === "status"
      ? getPriorityClassNames(task.priority)
      : getStatusClassNames(task.status);

  return (
    <div className="group bg-white dark:bg-sidebar border p-3 pb-5 rounded-md my-2 space-y-3 cursor-pointer">
      <div className="flex gap-3 items-start">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          className={cn("hidden group-hover:block mt-1", isChecked && "block")}
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
              <IconButton className="align-bottom">
                <MoreHorizontalIcon
                  size={18}
                  className="text-muted-foreground"
                />
                <span className="sr-only">More task actions</span>
              </IconButton>
            </TaskActionsDropdown>
          </div>
          <Badge
            variant="outline"
            className={cn(Object.values(fieldColors), "mt-3")}
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
