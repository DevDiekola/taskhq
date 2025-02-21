import IconButton from "@/components/icon-button/IconButton";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { Task, ViewGroupBy } from "@/features/task/taskModel";
import TaskActionsDropdown from "@/pages/my-tasks/components/task-actions-dropdown/TaskActionsDropdown";
import { toTitleCase } from "@/utils/string";
import { MoreHorizontalIcon } from "lucide-react";

type Props = {
  task: Task;
  groupBy?: ViewGroupBy;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (taskIDs: number | number[]) => void;
};

const TableTask: React.FC<Props> = ({
  task,
  groupBy,
  isChecked,
  onCheckedChange,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <TableRow key={task.id} className="cursor-pointer">
      <TableCell>
        <Checkbox checked={isChecked} onCheckedChange={onCheckedChange} />
      </TableCell>
      <TableCell className="font-medium">{task.title}</TableCell>
      {groupBy !== "status" && (
        <TableCell className="items-center justify-center">
          {toTitleCase(task.status)}
        </TableCell>
      )}
      {groupBy !== "priority" && (
        <TableCell className="items-center justify-center">
          {toTitleCase(task.priority)}
        </TableCell>
      )}
      <TableCell>
        <TaskActionsDropdown
          task={task}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        >
          <IconButton>
            <MoreHorizontalIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">Task actions</span>
          </IconButton>
        </TaskActionsDropdown>
      </TableCell>
    </TableRow>
  );
};

export default TableTask;
