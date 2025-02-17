import { createSlice } from '@reduxjs/toolkit';
import { Task, TaskState } from './taskModel';

const persistedTasksString = localStorage.getItem('tasks');

const persistedTasks = JSON.parse(persistedTasksString || '[]');

const initialState: TaskState = {
  tasks: persistedTasks,
  filter: '',
  currentPage: 1,
  pageSize: 10,
}

const persistTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      persistTasks(state.tasks);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        persistTasks(state.tasks);
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      persistTasks(state.tasks);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSort: (state, action) => {
      state.sortColumn = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
});

export const { addTask, updateTask, deleteTask, setFilter, setSort, setPage, setPageSize } = taskSlice.actions;
export default taskSlice.reducer;
