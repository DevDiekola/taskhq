import { View } from "@/pages/my-tasks/components/navbar/models/navbarModel";
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
    }
];