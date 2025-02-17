// I'm assuming task statuses can only be one of these three
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
// I'm assuming task priorities can only be one of these four
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskStateSortDirection = 'asc' | 'desc';
export type TaskStateGroupBy = 'priority' | 'status';

export type TaskState = {
  tasks: Task[];
  filter: string;
  groupBy: TaskStateGroupBy;
  sortColumn?: keyof Task;
  sortOrder?: TaskStateSortDirection;
  currentPage: number;
  pageSize: number;
};