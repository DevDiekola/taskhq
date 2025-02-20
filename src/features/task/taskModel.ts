// I'm assuming task statuses can only be one of these three
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
// I'm assuming task priorities can only be one of these four
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
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
  title: string;
  tasks: Task[];
};

export type ViewSortDirection = 'asc' | 'desc';
export type ViewGroupBy = 'priority' | 'status';

export type View = {
  filter?: Filter;
  groupBy?: ViewGroupBy;
  sortColumn?: keyof Task;
  sortOrder?: ViewSortDirection;
};

export type Filter = {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};