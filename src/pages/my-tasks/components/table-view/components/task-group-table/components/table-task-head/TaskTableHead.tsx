import IconButton from "@/components/icon-button/IconButton";
import { TableHead } from "@/components/ui/table";
import {
  CustomField,
  TaskSortColumn,
  TaskSortOrder,
} from "@/features/task/taskModel";
import { toTitleCase } from "@/utils/string";
import {
  EditIcon,
  LucideArrowDownAZ,
  LucideArrowUpZA,
  Trash2Icon,
} from "lucide-react";

type Prop = {
  columnID: TaskSortColumn;
  columnName: string;
  customField?: CustomField;
  sortColumn?: TaskSortColumn;
  sortOrder?: TaskSortOrder;
  onSortClick: (columnID: TaskSortColumn) => void;
  onEditClick?: (customField: CustomField) => void;
  onDeleteClick?: (customField: CustomField) => void;
};

const TaskTableHead: React.FC<Prop> = ({
  columnID,
  columnName,
  customField,
  sortColumn,
  sortOrder,
  onSortClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <TableHead>
      <div
        onClick={() => !customField && onSortClick(columnID)}
        className="flex justify-between items-center cursor-pointer"
      >
        <span className="whitespace-nowrap">{toTitleCase(columnName)}</span>
        <div className="flex gap-4">
          {customField && (
            <>
              <IconButton
                onClick={() => onDeleteClick?.(customField)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={`Delete custom field - ${columnName}`}
              >
                <Trash2Icon size={18} />
              </IconButton>
              <IconButton
                onClick={() => onEditClick?.(customField)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={`Edit custom field - ${columnName}`}
              >
                <EditIcon size={18} />
              </IconButton>
            </>
          )}
          {sortColumn === columnID && sortOrder === "desc" ? (
            <IconButton
              onClick={() => onSortClick(columnID)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={`Sort by ${columnName} in ascending order`}
            >
              <LucideArrowUpZA
                size={18}
                className={
                  sortColumn === columnID
                    ? "text-gray-700 dark:text-gray-200"
                    : "text-gray-200 dark:text-gray-700"
                }
              />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => onSortClick(columnID)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={`Sort by ${columnName} in ascending order`}
            >
              <LucideArrowDownAZ
                size={18}
                className={
                  sortColumn === columnID
                    ? "text-gray-700 dark:text-gray-200"
                    : "text-gray-200 dark:text-gray-700"
                }
              />
            </IconButton>
          )}
        </div>
      </div>
    </TableHead>
  );
};

export default TaskTableHead;
