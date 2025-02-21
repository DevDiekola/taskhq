import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VIEW_GROUP_BY } from "@/constants/task";
import { ViewGroupBy } from "@/features/task/taskModel";
import { setTableGroupBy } from "@/features/task/taskSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toTitleCase } from "@/utils/string";
import { GroupIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const TableGroupBy = () => {
  const {
    tableView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const dispatch = useDispatch();

  const handleSetGroupBy = (groupBy: ViewGroupBy, checked: boolean) => {
    const groupByValue = checked ? groupBy : undefined;

    dispatch(setTableGroupBy(groupByValue));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer">
          <GroupIcon size={13} className="mb-1" />
          <span className="font-medium">
            Group By{groupBy ? `: ${toTitleCase(groupBy)}` : ""}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        {VIEW_GROUP_BY.map((newGroup) => (
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

export default TableGroupBy;
