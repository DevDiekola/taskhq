import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import {
  Task,
  TaskFilter,
  TaskSortColumn,
  TaskSortOrder,
  TaskGroupBy,
  TableTaskGroup,
  KanbanTaskGroup,
  KanbanOrder,
  KanbanTaskGroupName,
  TaskGroupClassNames,
} from "@/features/task/taskModel";
import { PRIORITY_CLASS_NAMES, STATUS_CLASS_NAMES } from "@/constants/task";
import { TaskPriority, TaskStatus } from "@/features/task/taskModel";

export const getStatusClassNames = (
  status: TaskStatus
): TaskGroupClassNames => {
  return (
    STATUS_CLASS_NAMES[status] ?? {
      background: "bg-gray-100",
      foreground: "text-gray-800",
      border: "border-gray-100",
    }
  );
};

export const getPriorityClassNames = (
  priority: TaskPriority
): TaskGroupClassNames => {
  return (
    PRIORITY_CLASS_NAMES[priority] ?? {
      background: "bg-gray-100",
      foreground: "text-gray-800",
      border: "border-gray-100",
    }
  );
};

export const filterTasks = (tasks: Task[], filter?: TaskFilter) => {
  if (!filter) {
    return tasks;
  }

  let filteredTasks: Task[] = [...tasks];

  if (filter.title) {
    // Instead of a simple substring in string check, I'd prefer to make sure each word is considered separately
    const queryWords = filter.title
      .split(/\s+/)
      .filter((word) => word.trim().length > 0)
      .map((word) => word.toLowerCase()); // Code jargons for; split into words -> remove empty strings -> convert to lowercase

    filteredTasks = filteredTasks.filter((t) => {
      const titleLower = t.title.toLowerCase();
      // We are only including the task if all query words appear in the task title.
      return queryWords.every((word) => titleLower.includes(word));
    });
    // This could be a bit more advanced with fuzzy search (using something like fuze.js) but I think this is good enough for this specific use case.
  }
  if (filter.statuses && filter.statuses.length > 0) {
    filteredTasks = filteredTasks.filter((t) =>
      filter.statuses?.includes(t.status)
    );
  }
  if (filter.priorities && filter.priorities.length > 0) {
    filteredTasks = filteredTasks.filter((t) =>
      filter.priorities?.includes(t.priority)
    );
  }
  if (filter.customFieldValues) {
    filteredTasks = filteredTasks.filter((t) => {
      return Object.entries(filter.customFieldValues!).every(
        ([fieldID, filterValue]) => {
          const taskField = t.customFieldValues?.[Number(fieldID)];

          const filterTextValue = filterValue.textValue?.trim();
          const taskTextValue = taskField?.textValue?.trim();

          if (filterTextValue) {
            const queryWords = filterTextValue
              .split(/\s+/)
              .map((word) => word.toLowerCase());

            if (
              !taskTextValue ||
              !queryWords.every((word) =>
                taskTextValue.toLowerCase().includes(word)
              )
            ) {
              return false;
            }
          }

          if (
            filterValue.numberValue !== undefined &&
            taskField?.numberValue !== filterValue.numberValue
          ) {
            return false;
          }

          if (
            filterValue.checkboxValue !== undefined &&
            !(
              filterValue.checkboxValue === false &&
              taskField?.checkboxValue === undefined
            ) &&
            // If the checkboxValue is false, we want to consider tasks that have undefined checkboxValue set as valid
            taskField?.checkboxValue !== filterValue.checkboxValue
          ) {
            return false;
          }

          return true;
        }
      );
    });
  }

  return filteredTasks;
};

export const sortTasks = (
  tasks: Task[],
  sortColumn?: TaskSortColumn,
  sortOrder?: TaskSortOrder
) => {
  if (!sortColumn || !sortOrder) {
    return tasks;
  }

  const sortedTasks = [...tasks];

  sortedTasks.sort((a, b) => {
    let valueA: string | number | boolean;
    let valueB: string | number | boolean;

    if (typeof sortColumn === "string") {
      // Sort by built-in task properties (title, status, bla bla bla)
      valueA = a[sortColumn]!;
      valueB = b[sortColumn]!;
    } else {
      // Sort by custom field (number keys)
      const customFieldA = a.customFieldValues?.[sortColumn];
      const customFieldB = b.customFieldValues?.[sortColumn];

      if (
        customFieldA?.numberValue !== undefined ||
        customFieldB?.numberValue !== undefined
      ) {
        valueA = customFieldA?.numberValue ?? Number.NEGATIVE_INFINITY;
        valueB = customFieldB?.numberValue ?? Number.NEGATIVE_INFINITY;
      } else if (
        customFieldA?.textValue !== undefined ||
        customFieldB?.textValue !== undefined
      ) {
        valueA = customFieldA?.textValue?.toLowerCase() ?? "";
        valueB = customFieldB?.textValue?.toLowerCase() ?? "";
      } else if (
        customFieldA?.checkboxValue !== undefined ||
        customFieldB?.checkboxValue !== undefined
      ) {
        valueA = customFieldA?.checkboxValue ? 1 : 0;
        valueB = customFieldB?.checkboxValue ? 1 : 0;
      } else {
        // We are considering undefined values as "zero" values.
        // This way they will end up at the top or bottom of the list depending on the order.
        // I think it makes more sense than not considering them at all (making them always at the bottom).
        valueA = Number.NEGATIVE_INFINITY;
        valueB = Number.NEGATIVE_INFINITY;
      }
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });

  return sortedTasks;
};

export const groupTableTasks = (tasks: Task[], groupBy?: TaskGroupBy) => {
  let newTaskGroups: TableTaskGroup[] = [];

  if (groupBy === "priority") {
    newTaskGroups = TASK_PRIORITIES.map((priority) => ({
      name: priority,
      tasks: tasks.filter((t) => t.priority === priority),
    }));
  } else if (groupBy === "status") {
    newTaskGroups = TASK_STATUSES.map((status) => ({
      name: status,
      tasks: tasks.filter((t) => t.status === status),
    }));
  } else {
    newTaskGroups = [
      {
        name: "All tasks",
        tasks: tasks,
      },
    ];
  }

  return newTaskGroups;
};

export const groupKanbanTasks = (tasks: Task[], groupBy: TaskGroupBy) => {
  let newTaskGroups: KanbanTaskGroup[] = [];

  if (groupBy === "priority") {
    newTaskGroups = TASK_PRIORITIES.map((priority) => ({
      name: priority,
      tasks: tasks.filter((t) => t.priority === priority),
    }));
  } else {
    newTaskGroups = TASK_STATUSES.map((status) => ({
      name: status,
      tasks: tasks.filter((t) => t.status === status),
    }));
  }

  return newTaskGroups;
};

export const orderKanbanTask = (
  tasks: Task[],
  groupBy: TaskGroupBy,
  groupName: KanbanTaskGroupName,
  order?: KanbanOrder
) => {
  const newTasks = [...tasks];

  if (groupBy === "status" && order?.statusOrder?.[groupName]) {
    newTasks.sort(
      (a, b) =>
        order!.statusOrder![groupName]!.indexOf(a.id) -
        order!.statusOrder![groupName]!.indexOf(b.id)
    );
  } else if (groupBy === "priority" && order?.priorityOrder?.[groupName]) {
    newTasks.sort(
      (a, b) =>
        order!.priorityOrder![groupName]!.indexOf(a.id) -
        order!.priorityOrder![groupName]!.indexOf(b.id)
    );
  }
  return newTasks;
};

export const getFilterCount = (filter?: TaskFilter) => {
  let count = 0;

  if (filter?.title) {
    count += 1;
  }
  if (filter?.statuses && filter.statuses.length > 0) {
    count += filter.statuses.length;
  }
  if (filter?.priorities && filter.priorities.length > 0) {
    count += filter.priorities.length;
  }

  return count;
};
