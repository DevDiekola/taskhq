import { View } from "@/features/task/taskModel";
import { CircuitBoardIcon, TableCellsMergeIcon } from "lucide-react";

export const views: View[] = [
  {
    id: "table",
    name: "Table",
    icon: TableCellsMergeIcon,
  },
  {
    id: "kanban",
    name: "Kanban",
    icon: CircuitBoardIcon,
  },
];
