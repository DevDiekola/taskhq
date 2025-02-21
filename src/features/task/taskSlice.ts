import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskPayload, Task, TaskState, ViewGroupBy, TaskPriority, TaskStatus, TableView, KanbanView, TableViewSort } from './taskModel';
import { KANBAN_VIEW_LOCAL_STORAGE_KEY, MOCK_TASKS, TABLE_VIEW_LOCAL_STORAGE_KEY, TASK_LOCAL_STORAGE_KEY, TASK_SLICE_NAME } from '@/constants/task';
import historyReducer from '@/store/reducers/history';

const persistedTasksString = localStorage.getItem(TASK_LOCAL_STORAGE_KEY);
const persistedTableViewString = localStorage.getItem(TABLE_VIEW_LOCAL_STORAGE_KEY);
const persistedKanbanViewString = localStorage.getItem(KANBAN_VIEW_LOCAL_STORAGE_KEY);

const defaultTasks: Task[] = [];

const defaultTableView: TableView = {};
const defaultKanbanView: KanbanView = {groupBy: "priority"};

let persistedTasks = defaultTasks;
let persistedTableView = defaultTableView;
let persistedKanbanView = defaultKanbanView;

try {
  persistedTasks = persistedTasksString ? JSON.parse(persistedTasksString) : defaultTasks;
} catch (error) {
  console.error("Error parsing persisted tasks:", error);
}

try {
  persistedTableView = persistedTableViewString ? JSON.parse(persistedTableViewString) : persistedTableView;
} catch (error) {
  console.error("Error parsing persistedTableView:", error);
}

try {
  persistedKanbanView = persistedKanbanViewString ? JSON.parse(persistedKanbanViewString) : persistedKanbanView;
} catch (error) {
  console.error("Error parsing persistedKanbanView:", error);
}

const initialState: TaskState = {
  tasks: persistedTasks,
  tableView: persistedTableView,
  kanbanView: persistedKanbanView,
}

const taskSlice = createSlice({
  name: TASK_SLICE_NAME,
  initialState,
  reducers: {
    seedTasks: (state, action: PayloadAction<number>) => {
      // Only seeding the specified amount of tasks
      state.tasks = MOCK_TASKS.slice(0, action.payload);
    },
    createTask: (state, action: PayloadAction<TaskPayload>) => {
      // Getting the highest task ID plus one
      // I'm assuming task IDs are sequential and are incremented by 1
      const id = state.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0) + 1;
      const task: Task = { ...action.payload, id };

      state.tasks.push(task);
    },
    updateTask: (state, action: PayloadAction<TaskPayload>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index === -1) {
        return
      }
      state.tasks[index] = action.payload as Task;
    },
    bulkDeleteTasks: (state, action: PayloadAction<number[]>) => {
      state.tasks = state.tasks.filter(task => !action.payload.includes(task.id));
    },
    bulkSetTaskStatus: (state, action: PayloadAction<{ ids: number[], status: TaskStatus }>) => {
      state.tasks = state.tasks.map(task => {
        if (action.payload.ids.includes(task.id)) {
          return { ...task, status: action.payload.status }
        }
        return task;
      });
    },
    bulkSetTaskPriority: (state, action: PayloadAction<{ ids: number[], priority: TaskPriority }>) => {
      state.tasks = state.tasks.map(task => {
        if (action.payload.ids.includes(task.id)) {
          return { ...task, priority: action.payload.priority }
        }
        return task;
      });
    },
    setTableGroupBy: (state, action: PayloadAction<ViewGroupBy | undefined>) => {
      state.tableView.groupBy = action.payload;
      state.tableView.sortColumn = undefined;
      state.tableView.sortOrder =  undefined;
    },
    setKanbanGroupBy: (state, action: PayloadAction<ViewGroupBy>) => {
      state.kanbanView.groupBy = action.payload;
    },
    setTableSort: (state, action: PayloadAction<TableViewSort>) => {
      state.tableView.sortColumn = action.payload.sortColumn;
      state.tableView.sortOrder = action.payload.sortOrder;
    },
  },
});

export const { seedTasks, createTask, updateTask, bulkDeleteTasks, bulkSetTaskStatus, bulkSetTaskPriority, setTableGroupBy, setKanbanGroupBy, setTableSort } = taskSlice.actions;
export default historyReducer(taskSlice.reducer);
