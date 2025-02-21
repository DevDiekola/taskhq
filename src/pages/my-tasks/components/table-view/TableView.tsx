import { TaskGroup } from "@/features/task/taskModel";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import TableTaskGroup from "./components/table-task-group/TableTaskGroup";

const TableView = () => {
  const {
    tasks: allTasks,
    tableView: { groupBy, sortColumn, sortOrder },
  } = useAppSelector((state) => state.taskState.present);

  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);

  useEffect(() => {
    let newTaskGroups: TaskGroup[] = [];

    if (groupBy === "priority") {
      newTaskGroups = TASK_PRIORITIES.map((priority) => ({
        name: priority,
        tasks: allTasks.filter((t) => t.priority === priority),
      }));
    } else if (groupBy === "status") {
      newTaskGroups = TASK_STATUSES.map((status) => ({
        name: status,
        tasks: allTasks.filter((t) => t.status === status),
      }));
    } else {
      newTaskGroups = [
        {
          name: "All tasks",
          tasks: allTasks,
        },
      ];
    }

    setTaskGroups(newTaskGroups);
  }, [allTasks, groupBy]);

  useEffect(() => {
    if (!sortColumn || !sortOrder) {
      return;
    }

    setTaskGroups((prevTaskGroups) => {
      return prevTaskGroups.map((group) => {
        return {
          ...group,
          tasks: [...group.tasks].sort((a, b) => {
            if (sortOrder === "asc") {
              return a[sortColumn]! < b[sortColumn]! ? -1 : 1;
            } else {
              return a[sortColumn]! > b[sortColumn]! ? -1 : 1;
            }
          }),
        };
      });
    });
  }, [sortColumn, sortOrder]);

  return (
    <div className="flex flex-col gap-9 p-4 h-[calc(100dvh-100px)] overflow-y-auto">
      {taskGroups.map((group) => (
        <TableTaskGroup
          key={group.name} // group name is expected to be unique across all groups
          group={group}
          groupBy={groupBy}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
        />
      ))}
    </div>
  );
};

export default TableView;
