import { TableHead } from "@/components/ui/table";
import { ViewSortColumn, ViewSortOrder } from "@/features/task/taskModel";
import { toTitleCase } from "@/utils/string";
import { LucideArrowDownAZ, LucideArrowUpZA } from "lucide-react";

type Prop = {
  column: string;
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
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
          <LucideArrowUpZA
            size={17}
            className={
              sortColumn === column
                ? "text-foreground"
                : "text-muted-foreground"
            }
          />
        ) : (
          <LucideArrowDownAZ
            size={17}
            className={
              sortColumn === column
                ? "text-foreground"
                : "text-muted-foreground"
            }
          />
        )}
      </div>
    </TableHead>
  );
};

export default TaskTableHead;
