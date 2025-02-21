import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/features/task/taskModel";
import { CopyIcon, EditIcon, Trash2Icon } from "lucide-react";

type Prop = {
  task: Task;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (taskID: number) => void;
  children: React.ReactNode;
};

const TaskActionsDropdown: React.FC<Prop> = ({
  task,
  onEdit,
  onDuplicate,
  onDelete,
  children,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <EditIcon />
            <span>Edit task</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(task)}>
            <CopyIcon />
            <span>Duplicate</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(task.id)}
          className="text-red-500"
        >
          <Trash2Icon />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsDropdown;
