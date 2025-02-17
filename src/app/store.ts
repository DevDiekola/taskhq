import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/features/task/taskSlice';
import userReducer from '@/features/user/userSlice';
import workspaceReducer from '@/features/workspace/workspaceSlice';

export const store = configureStore({
  reducer: {
    taskState: taskReducer,
    userState: userReducer,
    workspaceState: workspaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;