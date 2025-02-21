import {
  Task,
  TaskGroup,
  TaskPayload,
  TaskPriority,
  TaskStatus,
  ViewGroupBy,
  ViewSortColumn,
  ViewSortOrder,
} from "@/features/task/taskModel";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toTitleCase } from "@/utils/string";
import CreateUpdateTaskModal from "@/pages/my-tasks/components/create-task-modal/CreateUpdateTaskModal";
import { useDispatch } from "react-redux";
import {
  bulkDeleteTasks,
  bulkSetTaskPriority,
  bulkSetTaskStatus,
  createTask,
  updateTask,
} from "@/features/task/taskSlice";
import DeleteTaskModal from "../../../delete-task-modal/DeleteTaskModal";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UNDO_TASK_ACTION } from "@/constants/task";
import { ReactSortable } from "react-sortablejs";
import KanbanTask from "./components/KanbanTask";
import BulkActionsDropdown from "../../../bulk-actions-dropdown/BulkActionsDropdown";

type Props = {
  group: TaskGroup;
  groupBy: ViewGroupBy;
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
};

const KanbanTaskGroup: React.FC<Props> = ({ group, groupBy }) => {
  const [isSaveTaskModalOpen, setIsSaveTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>();
  const [createTaskPriority, setCreateTaskPriority] = useState<TaskPriority>();

  const [taskToUpdate, setTaskToUpdate] = useState<Task>();
  const [bulkActionTaskIDs, setBulkActionTaskIDs] = useState<number[]>([]);

  const { name: groupName, tasks } = group;

  const dispatch = useDispatch();

  const handleCreateTaskModalOpen = () => {
    if (groupBy === "status") {
      setCreateTaskStatus(groupName as TaskStatus);
    } else if (groupBy === "priority") {
      setCreateTaskPriority(groupName as TaskPriority);
    }
    setIsSaveTaskModalOpen(true);
  };

  const handleUpdateTaskModalOpen = (task: Task) => {
    setTaskToUpdate(task);
    setIsSaveTaskModalOpen(true);
  };

  const handleTaskSubmit = (taskPayload: TaskPayload) => {
    setIsSaveTaskModalOpen(false);
    setTaskToUpdate(undefined);
    setCreateTaskStatus(undefined);
    setCreateTaskPriority(undefined);

    if (taskPayload.id) {
      dispatch(updateTask(taskPayload));
    } else {
      dispatch(createTask(taskPayload));
    }
  };

  const handleSaveTaskModalClose = () => {
    setIsSaveTaskModalOpen(false);
    setTaskToUpdate(undefined);
    setCreateTaskStatus(undefined);
    setCreateTaskPriority(undefined);
  };

  const handleDuplicateTask = (task: Task) => {
    const taskPayload: TaskPayload = {
      title: task.title,
      status: task.status,
      priority: task.priority,
    };
    dispatch(createTask(taskPayload));
  };

  const handleShowDeleteTaskModal = (taskIDs: number | number[]) => {
    setBulkActionTaskIDs(Array.isArray(taskIDs) ? taskIDs : [taskIDs]);
    setIsDeleteTaskModalOpen(true);
  };

  const handleDeleteTasks = (taskIDs: number[]) => {
    dispatch(bulkDeleteTasks(taskIDs));
    setBulkActionTaskIDs([]);
    setIsDeleteTaskModalOpen(false);

    toast({
      title: "Task(s) deleted successfully",
      description:
        "Having second thoughts? Click 'Undo' or press CTRL + Z (CMD + Z) to undo",
      action: (
        <ToastAction
          onClick={() => dispatch(UNDO_TASK_ACTION)}
          altText="Undo task delete"
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const handleDeleteTaskModalClose = () => {
    setBulkActionTaskIDs([]);
    setIsDeleteTaskModalOpen(false);
  };

  const getIsWholeGroupSelected = () => {
    return (
      tasks.length === bulkActionTaskIDs.length && bulkActionTaskIDs.length > 0
    );
  };

  const handleToggleTaskSelection = (taskID: number) => {
    if (bulkActionTaskIDs.includes(taskID)) {
      const newTaskIDs = bulkActionTaskIDs.filter((id) => id !== taskID);
      setBulkActionTaskIDs(newTaskIDs);
    } else {
      setBulkActionTaskIDs([...bulkActionTaskIDs, taskID]);
    }
  };

  const handleToggleGroupSelection = () => {
    if (getIsWholeGroupSelected()) {
      setBulkActionTaskIDs([]);
    } else {
      setBulkActionTaskIDs(tasks.map((task) => task.id));
    }
  };

  const handleBulkSetTaskStatus = (status: TaskStatus) => {
    dispatch(bulkSetTaskStatus({ ids: bulkActionTaskIDs, status }));
    setBulkActionTaskIDs([]);
  };

  const handleBulkSetTaskPriority = (priority: TaskPriority) => {
    dispatch(bulkSetTaskPriority({ ids: bulkActionTaskIDs, priority }));
    setBulkActionTaskIDs([]);
  };

  return (
    <div
      data-group-name={groupName}
      className="flex flex-col flex-shrink-0 w-[300px] h-[calc(100dvh-120px)] bg-muted dark:bg-gray rounded-sm"
    >
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex gap-3 items-center">
          {/* Again, only using the checkbox from shadcn for the uniform look.
          I'm not too lazy to write an HTML input checkbox 😭💀 */}
          <Checkbox
            checked={getIsWholeGroupSelected()}
            onCheckedChange={handleToggleGroupSelection}
          />
          <span>{toTitleCase(groupName)}</span>
          <span className="text-muted-foreground">({tasks.length})</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateTaskModalOpen}
            variant="outline"
            size="sm"
          >
            <PlusIcon />
            {bulkActionTaskIDs.length === 0 && <span>Add Task</span>}
          </Button>
          {bulkActionTaskIDs.length > 0 && (
            <BulkActionsDropdown
              taskIDs={bulkActionTaskIDs}
              onSetStatus={handleBulkSetTaskStatus}
              onSetPriority={handleBulkSetTaskPriority}
              onBulkDelete={handleShowDeleteTaskModal}
            >
              <Button
                onClick={handleCreateTaskModalOpen}
                variant="outline"
                size="sm"
              >
                <MoreHorizontalIcon />
              </Button>
            </BulkActionsDropdown>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full rounded-sm p-3 pt-0 overflow-y-auto">
        <ReactSortable
          list={tasks.map((t) => {
            return { ...t };
          })}
          setList={(movingTasks, sortable) => {
            if (!sortable) {
              return;
            }

            const newStageName = sortable.el
              .closest("[data-group-name]")
              ?.getAttribute("data-group-name");

            if (!newStageName) {
              return;
            }

            for (let i = 0; i < movingTasks.length; i++) {
              const task = { ...movingTasks[i] };

              if (groupBy === "status") {
                task.status = newStageName as TaskStatus;
              } else if (groupBy === "priority") {
                task.priority = newStageName as TaskPriority;
              }

              dispatch(updateTask(task));
            }
          }}
          animation={200}
          group={{ name: "shared", pull: true, put: true }}
          ghostClass="sortable-ghost"
          dragClass="sortable-drag"
          className="connect-sorting-content flex-1"
          multiDrag
          swap
        >
          {tasks.map((task) => {
            return (
              <KanbanTask
                key={task.id}
                task={task}
                groupBy={groupBy}
                isChecked={bulkActionTaskIDs.includes(task.id)}
                onCheckedChange={() => handleToggleTaskSelection(task.id)}
                onEdit={handleUpdateTaskModalOpen}
                onDuplicate={handleDuplicateTask}
                onDelete={handleShowDeleteTaskModal}
              />
            );
          })}
        </ReactSortable>
      </div>
      {isSaveTaskModalOpen && (
        <CreateUpdateTaskModal
          isOpen={isSaveTaskModalOpen}
          task={taskToUpdate}
          defaultStatus={createTaskStatus}
          defaultPriority={createTaskPriority}
          onSubmit={handleTaskSubmit}
          onClose={handleSaveTaskModalClose}
        />
      )}
      {isDeleteTaskModalOpen && bulkActionTaskIDs.length > 0 && (
        <DeleteTaskModal
          isOpen={isDeleteTaskModalOpen}
          taskIDs={bulkActionTaskIDs}
          onDelete={handleDeleteTasks}
          onClose={handleDeleteTaskModalClose}
        />
      )}
    </div>
  );
};

export default KanbanTaskGroup;
