import IconButton from "@/components/icon-button/IconButton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import {
  CustomField,
  Task,
  TaskGroupBy,
  TaskPayload,
  TaskPriority,
  TaskStatus,
} from "@/features/task/taskModel";
import { cn } from "@/lib/utils";
import TaskActionsDropdown from "@/pages/my-tasks/components/task-actions-dropdown/TaskActionsDropdown";
import { toTitleCase } from "@/utils/string";
import { getStatusClassNames, getPriorityClassNames } from "@/utils/task";
import { MoreHorizontalIcon } from "lucide-react";
import TaskTitleCell from "./components/task-title-cell/TaskTitleCell";
import TaskCustomFieldCell from "./components/task-custom-field-cell/TaskCustomFieldCell";

type Props = {
  task: Task;
  groupBy?: TaskGroupBy;
  isChecked: boolean;
  customFields: CustomField[];
  onCheckedChange: (checked: boolean) => void;
  onEdit: (task: Task) => void;
  onUpdate: (taskPayload: TaskPayload) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (taskIDs: number | number[]) => void;
};

const TableTask: React.FC<Props> = ({
  task,
  groupBy,
  isChecked,
  customFields,
  onCheckedChange,
  onEdit,
  onUpdate,
  onDuplicate,
  onDelete,
  ...props
}) => {
  const statusClassNames = getStatusClassNames(task.status);
  const priorityClassNames = getPriorityClassNames(task.priority);

  // const renderCustomFieldValue = (field: CustomField, task: Task) => {
  //   if (field.type === "text") {
  //     return task.customFieldValues?.[field.id]
  //       ? task.customFieldValues?.[field.id].textValue
  //       : "-";
  //   }
  //   if (field.type === "number") {
  //     return task.customFieldValues?.[field.id]
  //       ? task.customFieldValues?.[field.id].numberValue
  //       : "-";
  //   }
  //   if (field.type === "checkbox") {
  //     return (
  //       <Checkbox
  //         checked={task.customFieldValues?.[field.id]?.checkboxValue || false}
  //       />
  //     );
  //   }
  //   return "-";
  // };

  return (
    <TableRow className="cursor-pointer" key={task.id} {...props}>
      <TableCell>
        <Checkbox checked={isChecked} onCheckedChange={onCheckedChange} />
      </TableCell>
      <TaskTitleCell task={task} onUpdate={onUpdate} />
      {groupBy !== "status" && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge
                variant="outline"
                className={cn(Object.values(statusClassNames))}
              >
                {toTitleCase(task.status)}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={task.status}
                onValueChange={(value) =>
                  onUpdate({
                    ...task,
                    status: value as TaskStatus,
                  })
                }
              >
                {TASK_STATUSES.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    {toTitleCase(status)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
      {groupBy !== "priority" && (
        <TableCell className="items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge
                variant="outline"
                className={cn(Object.values(priorityClassNames))}
              >
                {toTitleCase(task.priority)}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={task.priority}
                onValueChange={(value) =>
                  onUpdate({
                    ...task,
                    priority: value as TaskPriority,
                  })
                }
              >
                {TASK_PRIORITIES.map((priority) => (
                  <DropdownMenuRadioItem key={priority} value={priority}>
                    {toTitleCase(priority)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
      {customFields.map((field) => (
        <TaskCustomFieldCell
          key={field.id}
          task={task}
          customField={field}
          onUpdate={onUpdate}
        />
      ))}
      <TableCell>
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
            <MoreHorizontalIcon size={18} className="text-muted-foreground" />
          </IconButton>
        </TaskActionsDropdown>
      </TableCell>
    </TableRow>
  );
};

export default TableTask;
