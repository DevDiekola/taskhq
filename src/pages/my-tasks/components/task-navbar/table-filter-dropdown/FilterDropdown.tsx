import NumberInput from "@/components/number-input/NumberInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  CustomField,
  KanbanView,
  TableView,
  TaskCustomFieldValues,
  TaskPriority,
  TaskStatus,
  ViewID,
} from "@/features/task/taskModel";
import { setKanbanFilter, setTableFilter } from "@/features/task/taskSlice";
import { toTitleCase } from "@/utils/string";
import { getFilterCount } from "@/utils/task";
import { ChevronDown, FilterIcon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  viewID: ViewID;
  tableView: TableView;
  kanbanView: KanbanView;
  customFields: CustomField[];
};
const FilterDropdown: React.FC<Props> = ({
  viewID,
  tableView,
  kanbanView,
  customFields,
}) => {
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

  const handleFilterByCustomValue = (
    customFieldID: number,
    key: keyof TaskCustomFieldValues,
    value: string | number | boolean | undefined
  ) => {
    const updatedFilter = {
      ...filter,
      customFieldValues: {
        ...filter?.customFieldValues,
        [customFieldID]: { [key]: value },
      },
    };

    dispatch(setFilter(updatedFilter));
  };

  const handleResetAll = () => {
    dispatch(setFilter(undefined));
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
      <PopoverContent className="min-w-80 flex flex-col gap-4">
        <Button
          onClick={handleResetAll}
          variant="secondary"
          className="inline-flex"
        >
          Reset all
        </Button>
        <div>
          <Label>Task title</Label>
          <Input
            defaultValue={filter?.title}
            onChange={(e) => handleFilterByTitle(e.target.value)}
            placeholder="Enter task title"
            className="mt-3"
          />
        </div>
        <div className="flex gap-5">
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
                    onSelect={(e) => {
                      // Doing this to prevent the dropdown menu from closing automatically
                      // since it's a multi-select dropdown. It's a little frustrating to have to open it everytime I want to select an option
                      e.preventDefault();
                    }}
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
                    onSelect={(e) => {
                      // Again, doing this to prevent the dropdown menu from closing automatically
                      // since it's a multi-select dropdown.
                      e.preventDefault();
                    }}
                  >
                    {toTitleCase(priority)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-3">
          {customFields.length > 0 && <Label>Custom Fields</Label>}
          {customFields.map((customField) => (
            <div
              key={customField.id}
              className={
                customField.type === "checkbox" ? "flex items-center gap-5" : ""
              }
            >
              <Label className="block">{customField.name}</Label>
              {customField.type === "text" && (
                <Input
                  className="mt-4"
                  placeholder={`Enter ${customField.name}`}
                  value={
                    filter?.customFieldValues?.[customField.id]?.textValue ?? ""
                  }
                  onChange={(e) =>
                    handleFilterByCustomValue(
                      customField.id,
                      "textValue",
                      e.target.value
                    )
                  }
                />
              )}
              {customField.type === "number" && (
                <NumberInput
                  className="mt-4"
                  placeholder={`Enter ${customField.name}`}
                  value={
                    filter?.customFieldValues?.[customField.id]?.numberValue
                  }
                  onNumberChange={(number) => {
                    handleFilterByCustomValue(
                      customField.id,
                      "numberValue",
                      number
                    );
                  }}
                />
              )}
              {customField.type === "checkbox" && (
                <Checkbox
                  checked={
                    !!filter?.customFieldValues?.[customField.id]?.checkboxValue
                  }
                  onCheckedChange={(checked) =>
                    handleFilterByCustomValue(
                      customField.id,
                      "checkboxValue",
                      checked === true
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
