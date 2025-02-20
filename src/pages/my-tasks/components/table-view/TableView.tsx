import { TaskGroup } from "@/features/task/taskModel";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import TaskTable from "./components/task-table/TaskTable";

const TableView = () => {
  const {
    tasks: allTasks,
    tableView: { groupBy },
  } = useAppSelector((state) => state.taskState);

  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);

  useEffect(() => {
    let taskGroups: TaskGroup[] = [];

    if (groupBy === "priority") {
      taskGroups = TASK_PRIORITIES.map((priority, index) => ({
        id: index + 1,
        title: priority,
        tasks: allTasks.filter((t) => t.priority === priority),
      }));
    } else if (groupBy === "status") {
      taskGroups = TASK_STATUSES.map((status, index) => ({
        id: index + 1,
        title: status,
        tasks: allTasks.filter((t) => t.status === status),
      }));
    } else {
      taskGroups = [
        {
          id: 1,
          title: "All tasks",
          tasks: allTasks,
        },
      ];
    }

    setTaskGroups(taskGroups);
  }, [allTasks, groupBy]);

  return (
    <div className="flex flex-col gap-9 p-4 h-[calc(100dvh-100px)] overflow-y-auto">
      {taskGroups.map((group) => (
        <TaskTable key={group.id} group={group} groupBy={groupBy} />
      ))}
    </div>
  );
};

export default TableView;
