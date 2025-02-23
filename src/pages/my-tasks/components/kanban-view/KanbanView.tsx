import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { KanbanTaskGroup } from "@/features/task/taskModel";
import TaskGroupKanban from "./components/task-group-kanban/TaskGroupKanban";
import { filterTasks, groupKanbanTasks } from "@/utils/task";

const KanbanView = () => {
  const {
    tasks: allTasks,
    kanbanView: { groupBy, order, filter },
  } = useAppSelector((state) => state.taskState.present);

  const [taskGroups, setTaskGroups] = useState<KanbanTaskGroup[]>([]);

  useEffect(() => {
    const filteredTasks = filterTasks(allTasks, filter);
    const taskGroups = groupKanbanTasks(filteredTasks, groupBy);

    setTaskGroups(taskGroups);
  }, [allTasks, filter, groupBy]);

  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {taskGroups.map((group) => (
        <TaskGroupKanban
          key={group.name} // group name is expected to be unique across all groups
          group={group}
          groupBy={groupBy}
          order={order}
        />
      ))}
    </div>
  );
};

export default KanbanView;
