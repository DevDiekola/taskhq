import { PayloadAction, Reducer } from '@reduxjs/toolkit';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

const historyReducer = <T>(reducer: Reducer<T, PayloadAction<string>>): Reducer<HistoryState<T>, PayloadAction<string>> => {
  const initialState: HistoryState<T> = {
    past: [],
    present: reducer(undefined, { type: 'INIT', payload: "history" }),
    future: [],
  };

  return (state = initialState, action: PayloadAction<string>): HistoryState<T> => {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO': {
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      }
      case 'REDO': {
        if (future.length === 0) return state;
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      }
      default: {
        const newPresent = reducer(present, action);
        if (newPresent === present) return state;
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
      }
    }
  };
};

export default historyReducer;