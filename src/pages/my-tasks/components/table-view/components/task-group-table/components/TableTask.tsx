import IconButton from "@/components/icon-button/IconButton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { CustomField, Task, TaskGroupBy } from "@/features/task/taskModel";
import { cn } from "@/lib/utils";
import TaskActionsDropdown from "@/pages/my-tasks/components/task-actions-dropdown/TaskActionsDropdown";
import { toTitleCase } from "@/utils/string";
import { getStatusClassNames, getPriorityClassNames } from "@/utils/task";
import { MoreHorizontalIcon } from "lucide-react";

type Props = {
  task: Task;
  groupBy?: TaskGroupBy;
  isChecked: boolean;
  customFields: CustomField[];
  onCheckedChange: (checked: boolean) => void;
  onEdit: (task: Task) => void;
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
  onDuplicate,
  onDelete,
  ...props
}) => {
  const statusClassNames = getStatusClassNames(task.status);
  const priorityClassNames = getPriorityClassNames(task.priority);

  const renderCustomFieldValue = (field: CustomField, task: Task) => {
    if (field.type === "text") {
      return task.customFieldValues?.[field.id]
        ? task.customFieldValues?.[field.id].textValue
        : "-";
    }
    if (field.type === "number") {
      return task.customFieldValues?.[field.id]
        ? task.customFieldValues?.[field.id].numberValue
        : "-";
    }
    if (field.type === "checkbox") {
      return task.customFieldValues?.[field.id] ? (
        <Checkbox
          checked={task.customFieldValues?.[field.id].checkboxValue || false}
        />
      ) : (
        "-"
      );
    }
    return "-";
  };

  return (
    <TableRow key={task.id} {...props}>
      <TableCell>
        <Checkbox checked={isChecked} onCheckedChange={onCheckedChange} />
      </TableCell>
      <TableCell className="font-medium">{task.title}</TableCell>
      {groupBy !== "status" && (
        <TableCell className="items-center justify-center">
          <Badge
            variant="outline"
            className={cn(Object.values(statusClassNames))}
          >
            {toTitleCase(task.status)}
          </Badge>
        </TableCell>
      )}
      {groupBy !== "priority" && (
        <TableCell className="items-center justify-center">
          <Badge
            variant="outline"
            className={cn(Object.values(priorityClassNames))}
          >
            {toTitleCase(task.priority)}
          </Badge>
        </TableCell>
      )}
      {customFields.map((field) => (
        <TableCell key={field.id} className="font-medium">
          {renderCustomFieldValue(field, task)}
        </TableCell>
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
