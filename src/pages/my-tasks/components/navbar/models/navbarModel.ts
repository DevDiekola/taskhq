import { type LucideIcon } from "lucide-react";

export type ViewID = "table" | "kanban"

export interface View {
    id: ViewID;
    name: string;
    icon: LucideIcon;
}