import { type LucideIcon } from "lucide-react";

export type ViewID = "table" | "kanban";

export interface View {
  id: ViewID;
  name: string;
  icon: LucideIcon;
}

// I'm assuming task statuses can only be one of these three (not nullable)
export type TaskStatus = "not_started" | "in_progress" | "completed";
// I'm assuming task priorities can only be one of these four (not nullable)
export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";

export type Task = {
  id: number; // I'm considering changing this to uuid
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  customFieldValues?: Record<number, TaskCustomFieldValues>; // number key is custom field id
};

export type TaskCustomFieldValues = {
  textValue?: string;
  numberValue?: number;
  checkboxValue?: boolean;
};

export type CustomFieldType = "text" | "number" | "checkbox";

export type CustomFieldOptions = string[] | number[];

export type CustomField = {
  id: number;
  name: string;
  type: CustomFieldType;
  options?: CustomFieldOptions;
};

export type CustomFieldPayload = {
  id?: number;
  name: string;
  type: CustomFieldType;
  options?: CustomFieldOptions;
};

export type TaskPayload = {
  id?: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  customFieldValues?: Record<number, TaskCustomFieldValues>; // number key is custom field id
};

export type TaskState = {
  tasks: Task[];
  customFields: CustomField[];
  tableView: TableView;
  kanbanView: KanbanView;
};

export type TableTaskGroupName = KanbanTaskGroupName | "All tasks";

export type TaskGroupClassNames = {
  background: string;
  foreground: string;
  border: string;
};

export type KanbanTaskGroupName = TaskStatus | TaskPriority;

export type TableTaskGroup = {
  name: TableTaskGroupName;
  tasks: Task[];
};

export type KanbanTaskGroup = {
  name: KanbanTaskGroupName;
  tasks: Task[];
};

export type TaskEdittableColumn = "title" | "status" | "priority" | number; // number is id of custom field

export type TaskSortColumn = "title" | "status" | "priority" | number; // number is id of custom field
export type TaskSortOrder = "asc" | "desc";
export type TaskGroupBy = "priority" | "status";

export type TableView = {
  filter?: TaskFilter;
  groupBy?: TaskGroupBy;
} & TableViewSort;

export type TableViewSort = {
  sortColumn?: TaskSortColumn;
  sortOrder?: TaskSortOrder;
};

export type KanbanView = {
  filter?: TaskFilter;
  groupBy: TaskGroupBy;
  order?: KanbanOrder;
};

export type KanbanOrderMap = Partial<Record<KanbanTaskGroupName, number[]>>;

export type KanbanOrder = {
  statusOrder?: KanbanOrderMap;
  priorityOrder?: KanbanOrderMap;
};

export type ReOrderKanbanTasksPayload = {
  tasksToUpdate: Task[];
  newOrder: number[];
  groupBy: TaskGroupBy;
  groupName: KanbanTaskGroupName;
};

export type TaskFilter = {
  title?: string;
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  customFieldValues?: Record<number, TaskCustomFieldValues>; // number key is custom field id
};
