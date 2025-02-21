import { Action, Middleware } from '@reduxjs/toolkit';
import { TASK_LOCAL_STORAGE_KEY, TABLE_VIEW_LOCAL_STORAGE_KEY, KANBAN_VIEW_LOCAL_STORAGE_KEY } from '@/constants/task';
import { RootState } from '../reducers/root';

const localStorageMiddleware: Middleware<object, RootState> = storeAPI => next => action => {
    const result = next(action);

    if ((action as Action).type.startsWith("task/")) {
        return;
    }

    const state = storeAPI.getState();

    localStorage.setItem(TASK_LOCAL_STORAGE_KEY, JSON.stringify(state.taskState.present.tasks));
    localStorage.setItem(TABLE_VIEW_LOCAL_STORAGE_KEY, JSON.stringify(state.taskState.present.tableView));
    localStorage.setItem(KANBAN_VIEW_LOCAL_STORAGE_KEY, JSON.stringify(state.taskState.present.kanbanView));

    return result;
};

export default localStorageMiddleware;