// I'm assuming task statuses can only be one of these three
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
// I'm assuming task priorities can only be one of these four
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type TaskPayload = {
  id?: number;
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type TaskState = {
  tasks: Task[];
  tableView: View;
  kanbanView: View;
};

export type TaskGroup = {
  id: number;
  name: string;
  tasks: Task[];
};

export type ViewSortColumn = keyof Task;
export type ViewSortOrder = 'asc' | 'desc';
export type ViewGroupBy = 'priority' | 'status';

export type View = ViewSort & {
  filter?: Filter;
  groupBy?: ViewGroupBy;
};

export type ViewSort = {
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
}

export type Filter = {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};