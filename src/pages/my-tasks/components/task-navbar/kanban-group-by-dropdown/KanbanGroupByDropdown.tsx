import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_GROUPS } from "@/constants/task";
import { TaskGroupBy } from "@/features/task/taskModel";
import { setKanbanGroupBy } from "@/features/task/taskSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toTitleCase } from "@/utils/string";
import { GridIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const KanbanGroupByDropdown = () => {
  const {
    kanbanView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const dispatch = useDispatch();

  const handleSetGroupBy = (groupBy: TaskGroupBy) => {
    dispatch(setKanbanGroupBy(groupBy));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Group by dropdown"
          className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer"
        >
          <GridIcon size={17} className="mb-1" />
          <span className="font-medium">
            {groupBy ? (
              toTitleCase(groupBy)
            ) : (
              <span>
                Group<span className="max-sm:hidden"> By</span>
              </span>
            )}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        <DropdownMenuRadioGroup
          value={groupBy}
          onValueChange={(value) => handleSetGroupBy(value as TaskGroupBy)}
        >
          {TASK_GROUPS.map((groupBy) => (
            <DropdownMenuRadioItem key={groupBy} value={groupBy}>
              {toTitleCase(groupBy)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KanbanGroupByDropdown;
