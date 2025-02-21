import { TaskGroup } from "@/features/task/taskModel";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import KanbanTaskGroup from "./components/task-group-column/KanbanTaskGroup";

const KanbanView = () => {
  const {
    tasks: allTasks,
    kanbanView: { groupBy },
  } = useAppSelector((state) => state.taskState.present);

  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);

  useEffect(() => {
    let newTaskGroups: TaskGroup[] = [];

    if (groupBy === "priority") {
      newTaskGroups = TASK_PRIORITIES.map((priority) => ({
        name: priority,
        tasks: allTasks.filter((t) => t.priority === priority),
      }));
    } else {
      newTaskGroups = TASK_STATUSES.map((status) => ({
        name: status,
        tasks: allTasks.filter((t) => t.status === status),
      }));
    }

    setTaskGroups(newTaskGroups);
  }, [allTasks, groupBy]);

  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {taskGroups.map((group) => (
        <KanbanTaskGroup
          key={group.name} // group name is expected to be unique across all groups
          group={group}
          groupBy={groupBy}
        />
      ))}
    </div>
  );
};

export default KanbanView;
