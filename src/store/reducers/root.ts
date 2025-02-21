import { combineReducers } from '@reduxjs/toolkit';
import taskReducer from '@/features/task/taskSlice';
import userReducer from '@/features/user/userSlice';
import workspaceReducer from '@/features/workspace/workspaceSlice';

export const rootReducer = combineReducers({
  taskState: taskReducer,
  userState: userReducer,
  workspaceState: workspaceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
