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
} from "@/features/task/taskModel";

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
    if (sortOrder === "asc") {
      return a[sortColumn]! < b[sortColumn]! ? -1 : 1;
    } else {
      return a[sortColumn]! > b[sortColumn]! ? -1 : 1;
    }
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
