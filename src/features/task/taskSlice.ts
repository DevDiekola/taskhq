import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TaskPayload,
  Task,
  TaskState,
  TaskGroupBy,
  TaskPriority,
  TaskStatus,
  TableView,
  KanbanView,
  TableViewSort,
  KanbanOrderMap,
  ReOrderKanbanTasksPayload,
  TaskFilter,
  CustomFieldPayload,
  CustomField,
} from "./taskModel";
import {
  CUSTOM_FIELDS_LOCAL_STORAGE_KEY,
  KANBAN_VIEW_LOCAL_STORAGE_KEY,
  MOCK_TASKS,
  TABLE_VIEW_LOCAL_STORAGE_KEY,
  TASKS_LOCAL_STORAGE_KEY,
  TASK_SLICE_NAME,
} from "@/constants/task";
import historyReducer from "@/store/reducers/history";

const persistedTasksString = localStorage.getItem(TASKS_LOCAL_STORAGE_KEY);
const persistedTableViewString = localStorage.getItem(
  TABLE_VIEW_LOCAL_STORAGE_KEY
);
const persistedKanbanViewString = localStorage.getItem(
  KANBAN_VIEW_LOCAL_STORAGE_KEY
);
const persistedCustomFieldsString = localStorage.getItem(
  CUSTOM_FIELDS_LOCAL_STORAGE_KEY
);

const defaultTasks: Task[] = [];
const defaultTableView: TableView = {};
const defaultKanbanView: KanbanView = { groupBy: "priority" };
const defaulCustomFields: CustomField[] = [];

let persistedTasks = defaultTasks;
let persistedTableView = defaultTableView;
let persistedKanbanView = defaultKanbanView;
let persistedCustomFields = defaulCustomFields;

try {
  persistedTasks = persistedTasksString
    ? JSON.parse(persistedTasksString)
    : defaultTasks;
} catch (error) {
  console.error("Error parsing persisted tasks:", error);
}

try {
  persistedTableView = persistedTableViewString
    ? JSON.parse(persistedTableViewString)
    : persistedTableView;
} catch (error) {
  console.error("Error parsing persistedTableView:", error);
}

try {
  persistedKanbanView = persistedKanbanViewString
    ? JSON.parse(persistedKanbanViewString)
    : persistedKanbanView;
} catch (error) {
  console.error("Error parsing persistedKanbanView:", error);
}

try {
  persistedCustomFields = persistedCustomFieldsString
    ? JSON.parse(persistedCustomFieldsString)
    : persistedCustomFields;
} catch (error) {
  console.error("Error parsing persistedCustomFields:", error);
}

const initialState: TaskState = {
  tasks: persistedTasks,
  tableView: persistedTableView,
  kanbanView: persistedKanbanView,
  customFields: persistedCustomFields,
};

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
      const id =
        state.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0) +
        1;
      const task: Task = { ...action.payload, id };

      state.tasks.push(task);
    },
    updateTask: (state, action: PayloadAction<TaskPayload>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index === -1) {
        return;
      }
      state.tasks[index] = action.payload as Task;
    },
    bulkDeleteTasks: (state, action: PayloadAction<number[]>) => {
      state.tasks = state.tasks.filter(
        (task) => !action.payload.includes(task.id)
      );
    },
    bulkSetTaskStatus: (
      state,
      action: PayloadAction<{ ids: number[]; status: TaskStatus }>
    ) => {
      state.tasks = state.tasks.map((task) => {
        if (action.payload.ids.includes(task.id)) {
          return { ...task, status: action.payload.status };
        }
        return task;
      });
    },
    bulkSetTaskPriority: (
      state,
      action: PayloadAction<{ ids: number[]; priority: TaskPriority }>
    ) => {
      state.tasks = state.tasks.map((task) => {
        if (action.payload.ids.includes(task.id)) {
          return { ...task, priority: action.payload.priority };
        }
        return task;
      });
    },
    setTableGroupBy: (
      state,
      action: PayloadAction<TaskGroupBy | undefined>
    ) => {
      state.tableView.groupBy = action.payload;
      state.tableView.sortColumn = undefined;
      state.tableView.sortOrder = undefined;
    },
    setKanbanGroupBy: (state, action: PayloadAction<TaskGroupBy>) => {
      state.kanbanView.groupBy = action.payload;
    },
    setTableSort: (state, action: PayloadAction<TableViewSort>) => {
      state.tableView.sortColumn = action.payload.sortColumn;
      state.tableView.sortOrder = action.payload.sortOrder;
    },
    reOrderKanbanTasks: (
      state,
      action: PayloadAction<ReOrderKanbanTasksPayload>
    ) => {
      // Ideally, the logic here should be split across two reducers for single responsibility sake.
      // One to handle the bulk updates of the tasks
      // Another to handle the re-ordering of the tasks
      // But that'd cause two separate state histories to be created, making the user have to undo twice to reset the order
      // There are probably ways to get around that but I'm willing to make this tradeoff for now.
      const tasksToUpdateIDs = action.payload.tasksToUpdate.map(
        (task) => task.id
      );
      if (tasksToUpdateIDs.length > 0) {
        state.tasks = state.tasks.map((task) => {
          const taskPosition = tasksToUpdateIDs.indexOf(task.id);
          if (taskPosition !== -1) {
            return action.payload.tasksToUpdate[taskPosition];
          }
          return task;
        });
      }

      if (action.payload.groupBy === "priority") {
        // Updating the priority order for each priority
        const priorityOrder: KanbanOrderMap = {
          ...state.kanbanView.order?.priorityOrder,
          [action.payload.groupName]: action.payload.newOrder,
        };
        state.kanbanView.order = { ...state.kanbanView.order, priorityOrder };
      } else {
        // Updating the status order for each status
        const statusOrder: KanbanOrderMap = {
          ...state.kanbanView.order?.statusOrder,
          [action.payload.groupName]: action.payload.newOrder,
        };
        state.kanbanView.order = { ...state.kanbanView.order, statusOrder };
      }
    },
    setTableFilter: (state, action: PayloadAction<TaskFilter | undefined>) => {
      state.tableView.filter = action.payload;
    },
    setKanbanFilter: (state, action: PayloadAction<TaskFilter | undefined>) => {
      state.kanbanView.filter = action.payload;
    },
    createCustomField: (state, action: PayloadAction<CustomFieldPayload>) => {
      // Again, getting the highest custom field ID plus one
      // I'm assuming custom field IDs are sequential and are incremented by 1
      const id =
        state.customFields.reduce(
          (max, customField) => (customField.id > max ? customField.id : max),
          0
        ) + 1;
      const customField: CustomField = { ...action.payload, id };

      state.customFields.push(customField);
    },
    updateCustomField: (state, action: PayloadAction<CustomFieldPayload>) => {
      const index = state.customFields.findIndex(
        (customField) => customField.id === action.payload.id
      );
      if (index === -1) {
        return;
      }
      state.customFields[index] = action.payload as CustomField;
    },
    deleteCustomField: (state, action: PayloadAction<number>) => {
      const customFieldID = action.payload;

      state.customFields = state.customFields.filter(
        (customField) => customField.id !== customFieldID
      );

      // Removing the custom field from each task
      state.tasks = state.tasks.map((task) => {
        if (!task.customFieldValues) return task;
        if (!(customFieldID in task.customFieldValues)) return task;

        // Creating a clone and deleting the custom field with matching key.
        // We don't want to mutate the original object directly
        const customFieldValuesClone = { ...task.customFieldValues };
        delete customFieldValuesClone[customFieldID];

        // If the clone is now empty, set the customFieldValues to undefined
        // else set the customFieldValues to the clone.
        const updatedTask = {
          ...task,
          customFieldValues:
            Object.keys(customFieldValuesClone).length > 0
              ? customFieldValuesClone
              : undefined,
        };

        return updatedTask;
      });
    },
  },
});

export const {
  seedTasks,
  createTask,
  updateTask,
  bulkDeleteTasks,
  bulkSetTaskStatus,
  bulkSetTaskPriority,
  setTableGroupBy,
  setKanbanGroupBy,
  setTableSort,
  reOrderKanbanTasks,
  setTableFilter,
  setKanbanFilter,
  createCustomField,
  updateCustomField,
  deleteCustomField,
} = taskSlice.actions;
export default historyReducer(taskSlice.reducer);
