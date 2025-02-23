import { configureStore } from "@reduxjs/toolkit";
import taskStorageMiddleware from "./middlewares/taskStorage";
import { rootReducer } from "./reducers/root";

const store = configureStore({
  reducer: rootReducer,
  // Using the local storage middleware to persist task state in local storage.
  // Doing it globally instead of after every action in the taskSlice mainly due to undo/redo history.
  // Technically, I could also just subscribe to the store and update on every action (slightly simpler implementation IMO)
  // but it comes with major tradeoffs.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskStorageMiddleware),
});

export default store;
