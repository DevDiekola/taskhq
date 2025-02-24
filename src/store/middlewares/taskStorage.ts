import { Action, Middleware, PayloadAction } from "@reduxjs/toolkit";
import {
  TASKS_LOCAL_STORAGE_KEY,
  TABLE_VIEW_LOCAL_STORAGE_KEY,
  KANBAN_VIEW_LOCAL_STORAGE_KEY,
  TASK_SLICE_NAME,
  CUSTOM_FIELDS_LOCAL_STORAGE_KEY,
} from "@/constants/task";
import { RootState } from "../reducers/root";

const taskStorageMiddleware: Middleware<object, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (
      !(action as Action).type.startsWith(`${TASK_SLICE_NAME}/`) &&
      (action as PayloadAction<string>)?.payload !== TASK_SLICE_NAME
    ) {
      return;
    }

    const state = storeAPI.getState();

    localStorage.setItem(
      TASKS_LOCAL_STORAGE_KEY,
      JSON.stringify(state.taskState.present.tasks)
    );
    localStorage.setItem(
      TABLE_VIEW_LOCAL_STORAGE_KEY,
      JSON.stringify(state.taskState.present.tableView)
    );
    localStorage.setItem(
      KANBAN_VIEW_LOCAL_STORAGE_KEY,
      JSON.stringify(state.taskState.present.kanbanView)
    );
    localStorage.setItem(
      CUSTOM_FIELDS_LOCAL_STORAGE_KEY,
      JSON.stringify(state.taskState.present.customFields)
    );

    return result;
  };

export default taskStorageMiddleware;
