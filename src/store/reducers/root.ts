import { combineReducers } from "@reduxjs/toolkit";
import taskReducer from "@/features/task/taskSlice";
import themeReducer from "@/features/theme/themeSlice";

export const rootReducer = combineReducers({
  taskState: taskReducer,
  themeState: themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
