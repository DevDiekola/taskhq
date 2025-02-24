import { useState, useRef, useEffect } from "react";
import IconButton from "@/components/icon-button/IconButton";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { Task, TaskPayload } from "@/features/task/taskModel";
import { EditIcon } from "lucide-react";

type Props = {
  task: Task;
  onUpdate: (taskPayload: TaskPayload) => void;
};

const TaskTitleCell: React.FC<Props> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
    setTempTitle(task.title);
  };

  const saveTitle = () => {
    if (tempTitle.trim() && tempTitle !== task.title) {
      onUpdate({ ...task, title: tempTitle });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle();
    } else if (e.key === "Escape") {
      setTempTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <TableCell className={isEditing ? "p-2" : ""}>
      <div className="group flex justify-between items-center gap-5 font-medium">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleKeyDown}
            className="p-1 border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent"
          />
        ) : (
          <span onClick={startEditing} className="w-full cursor-pointer">
            {task.title}
          </span>
        )}

        <IconButton
          onClick={startEditing}
          className="p-1 opacity-0 group-hover:opacity-100 bg-black hover:bg-gray-800 border border-gray-500"
          aria-label={`Edit cell for ${task.title}`}
        >
          <EditIcon size={18} className="text-muted-foreground" />
        </IconButton>
      </div>
    </TableCell>
  );
};

export default TaskTitleCell;
