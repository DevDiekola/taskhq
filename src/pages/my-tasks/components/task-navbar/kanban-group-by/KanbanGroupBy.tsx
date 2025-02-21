import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VIEW_GROUP_BY } from "@/constants/task";
import { ViewGroupBy } from "@/features/task/taskModel";
import { setKanbanGroupBy } from "@/features/task/taskSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toTitleCase } from "@/utils/string";
import { GroupIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const KanbanGroupBy = () => {
  const {
    kanbanView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const dispatch = useDispatch();

  const handleSetGroupBy = (groupBy: ViewGroupBy) => {
    dispatch(setKanbanGroupBy(groupBy));
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
        <DropdownMenuRadioGroup
          value={groupBy}
          onValueChange={(value) => handleSetGroupBy(value as ViewGroupBy)}
        >
          {VIEW_GROUP_BY.map((groupBy) => (
            <DropdownMenuRadioItem key={groupBy} value={groupBy}>
              {toTitleCase(groupBy)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KanbanGroupBy;
