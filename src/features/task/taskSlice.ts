import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskPayload, Task, TaskState, View, ViewGroupBy, ViewSort } from './taskModel';
import { KANBAN_VIEW_LOCAL_STORAGE_KEY, TABLE_VIEW_LOCAL_STORAGE_KEY, TASK_LOCAL_STORAGE_KEY } from '@/constants/task';
import historyReducer from '@/store/reducers/history';

const persistedTasksString = localStorage.getItem(TASK_LOCAL_STORAGE_KEY);
const persistedTableViewString = localStorage.getItem(TABLE_VIEW_LOCAL_STORAGE_KEY);
const persistedKanbanViewString = localStorage.getItem(KANBAN_VIEW_LOCAL_STORAGE_KEY);

const defaultTasks: Task[] = [];

const defaultView: View = {};

let persistedTasks: Task[] = defaultTasks;
let persistedTableView: View = defaultView;
let persistedKanbanView: View = defaultView;

try {
  persistedTasks = persistedTasksString ? JSON.parse(persistedTasksString) : defaultTasks;
} catch (error) {
  console.error("Error parsing persisted tasks:", error);
}

try {
  persistedTableView = persistedTableViewString ? JSON.parse(persistedTableViewString) : defaultView;
} catch (error) {
  console.error("Error parsing persistedTableView:", error);
}

try {
  persistedKanbanView = persistedKanbanViewString ? JSON.parse(persistedKanbanViewString) : defaultView;
} catch (error) {
  console.error("Error parsing persistedKanbanView:", error);
}

const initialState: TaskState = {
  tasks: persistedTasks,
  tableView: persistedTableView,
  kanbanView: persistedKanbanView,
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
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
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setTableGroupBy: (state, action: PayloadAction<ViewGroupBy | undefined>) => {
      state.tableView.groupBy = action.payload;
      state.tableView.sortColumn = undefined;
      state.tableView.sortOrder =  undefined;
    },
    setKanbanGroupBy: (state, action: PayloadAction<ViewGroupBy | undefined>) => {
      state.kanbanView.groupBy = action.payload;
    },
    setTableSort: (state, action: PayloadAction<ViewSort>) => {
      state.tableView.sortColumn = action.payload.sortColumn;
      state.tableView.sortOrder = action.payload.sortOrder;
    },
  },
});

export const { createTask, updateTask, deleteTask, setTableGroupBy, setKanbanGroupBy, setTableSort } = taskSlice.actions;
export default historyReducer(taskSlice.reducer);
