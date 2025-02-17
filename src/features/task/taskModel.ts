export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskState = {
  tasks: Task[];
  filter: string;
  sortColumn?: keyof Task;
  sortDirection?: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
};