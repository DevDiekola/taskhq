import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_GROUPS } from "@/constants/task";
import { TaskGroupBy } from "@/features/task/taskModel";
import { setTableGroupBy } from "@/features/task/taskSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toTitleCase } from "@/utils/string";
import { GridIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const TableGroupByDropdown = () => {
  const {
    tableView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const dispatch = useDispatch();

  const handleSetGroupBy = (groupBy: TaskGroupBy, checked: boolean) => {
    const groupByValue = checked ? groupBy : undefined;

    dispatch(setTableGroupBy(groupByValue));
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
        {TASK_GROUPS.map((newGroup) => (
          <DropdownMenuCheckboxItem
            key={newGroup}
            checked={newGroup === groupBy}
            onCheckedChange={(checked) => handleSetGroupBy(newGroup, checked)}
          >
            {toTitleCase(newGroup)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableGroupByDropdown;
