import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import { TaskPriority, TaskStatus, ViewID } from "@/features/task/taskModel";
import { setKanbanFilter, setTableFilter } from "@/features/task/taskSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toTitleCase } from "@/utils/string";
import { getFilterCount } from "@/utils/task";
import { ChevronDown, FilterIcon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  viewID: ViewID;
};
const FilterDropdown: React.FC<Props> = ({ viewID }) => {
  const { tableView, kanbanView } = useAppSelector(
    (state) => state.taskState.present
  );

  const dispatch = useDispatch();

  const { filter } = viewID === "table" ? tableView : kanbanView;
  const setFilter = viewID === "table" ? setTableFilter : setKanbanFilter;

  const handleFilterByTitle = (title: string) => {
    // I'd typically use a debouncer here especially if we're making API requests
    // to avoid making too many requests
    // but since we're not doing that, let's make this thing fasttttt :)
    dispatch(setFilter({ ...filter, title }));
  };

  const handleFilterByStatus = (status: TaskStatus, checked: boolean) => {
    let statuses = [...(filter?.statuses ?? [])];

    if (checked) {
      statuses.push(status);
    } else {
      statuses = statuses.filter((s) => s !== status);
    }

    dispatch(setFilter({ ...filter, statuses }));
  };

  const handleFilterByPriority = (priority: TaskPriority, checked: boolean) => {
    let priorities = [...(filter?.priorities ?? [])];

    if (checked) {
      priorities.push(priority);
    } else {
      priorities = priorities.filter((p) => p !== priority);
    }

    dispatch(setFilter({ ...filter, priorities }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Filter dropdown"
          className="flex items-center gap-1 text-muted-foreground py-2 cursor-pointer"
        >
          <FilterIcon size={17} className="mb-1" />
          <span className="font-medium">
            <span className="max-sm:hidden">Filter </span>
            <span>({getFilterCount(filter)})</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-80">
        <Label>Task title</Label>
        <Input
          defaultValue={filter?.title}
          onChange={(e) => handleFilterByTitle(e.target.value)}
          placeholder="Enter task title"
          className="mt-3"
        />
        <div className="flex gap-5 mt-5">
          <div className="flex-1">
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mt-3">
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                >
                  <span>Status ({filter?.statuses?.length ?? 0})</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-52">
                {TASK_STATUSES.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filter?.statuses?.includes(status)}
                    onCheckedChange={(checked) =>
                      handleFilterByStatus(status, checked)
                    }
                  >
                    {toTitleCase(status)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <Label>Priority</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mt-3">
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                >
                  <span>Priority ({filter?.priorities?.length ?? 0})</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-52">
                {TASK_PRIORITIES.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={filter?.priorities?.includes(priority)}
                    onCheckedChange={(checked) =>
                      handleFilterByPriority(priority, checked)
                    }
                  >
                    {toTitleCase(priority)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
