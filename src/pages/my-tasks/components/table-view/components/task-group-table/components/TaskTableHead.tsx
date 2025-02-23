import IconButton from "@/components/icon-button/IconButton";
import { TableHead } from "@/components/ui/table";
import { TaskSortColumn, TaskSortOrder } from "@/features/task/taskModel";
import { toTitleCase } from "@/utils/string";
import { LucideArrowDownAZ, LucideArrowUpZA } from "lucide-react";

type Prop = {
  column: string;
  sortColumn?: TaskSortColumn;
  sortOrder?: TaskSortOrder;
  onClick?: () => void;
};

const TaskTableHead: React.FC<Prop> = ({
  column,
  sortColumn,
  sortOrder,
  onClick,
}) => {
  return (
    <TableHead onClick={onClick}>
      <div className="w-full flex justify-between items-center cursor-pointer">
        <span>{toTitleCase(column)}</span>
        {sortColumn === column && sortOrder === "desc" ? (
          <IconButton aria-label={`Sort by ${column} in ascending order`}>
            <LucideArrowUpZA
              size={18}
              className={
                sortColumn === column ? "text-gray-800" : "text-gray-300"
              }
            />
          </IconButton>
        ) : (
          <IconButton aria-label={`Sort by ${column} in ascending order`}>
            <LucideArrowDownAZ
              size={18}
              className={
                sortColumn === column ? "text-gray-800" : "text-gray-300"
              }
            />
          </IconButton>
        )}
      </div>
    </TableHead>
  );
};

export default TaskTableHead;
