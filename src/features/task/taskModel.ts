// I'm assuming task statuses can only be one of these three (not nullable)
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
// I'm assuming task priorities can only be one of these four (not nullable)
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskPayload = {
  id?: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskState = {
  tasks: Task[];
  tableView: TableView;
  kanbanView: KanbanView;
};

export type TaskGroupName = TaskStatus | TaskPriority | 'All tasks';

export type TaskGroup = {
  // id: number;
  name: TaskGroupName;
  tasks: Task[];
};

export type ViewSortColumn = keyof Task;
export type ViewSortOrder = 'asc' | 'desc';
export type ViewGroupBy = 'priority' | 'status';

export type TableView = TableViewSort & {
  filter?: TaskFilter;
  groupBy?: ViewGroupBy;
}

export type TableViewSort = {
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
}

export type KanbanView = {
  filter?: TaskFilter;
  groupBy: ViewGroupBy;
};

export type TaskFilter = {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};