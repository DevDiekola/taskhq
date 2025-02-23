import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import TaskGroupTable from "./components/task-group-table/TaskGroupTable";
import { TableTaskGroup } from "@/features/task/taskModel";
import { filterTasks, groupTableTasks, sortTasks } from "@/utils/task";

const TableView = () => {
  const {
    tasks: allTasks,
    tableView: { groupBy, sortColumn, sortOrder, filter },
  } = useAppSelector((state) => state.taskState.present);

  const [taskGroups, setTaskGroups] = useState<TableTaskGroup[]>([]);

  useEffect(() => {
    const filteredTasks = filterTasks(allTasks, filter);
    const sortedTasks = sortTasks(filteredTasks, sortColumn, sortOrder);
    const taskGroups = groupTableTasks(sortedTasks, groupBy);

    setTaskGroups(taskGroups);
  }, [allTasks, filter, groupBy, sortColumn, sortOrder]);

  return (
    <div className="flex flex-col gap-9 p-4 h-[calc(100dvh-100px)] overflow-y-auto">
      {taskGroups.map((group) => (
        <TaskGroupTable
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
