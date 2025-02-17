import { CalendarIcon, CircuitBoardIcon, TableCellsMergeIcon, type LucideIcon } from "lucide-react";

export type ViewID = "table" | "kanban" | "calendar"

export interface View {
    id: ViewID;
    name: string;
    icon: LucideIcon;
}

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
    {
        id: "calendar",
        name: "Calendar",
        icon: CalendarIcon,
    },
];