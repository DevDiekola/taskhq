import {
  KanbanOrder,
  Task,
  TaskPayload,
  TaskPriority,
  TaskStatus,
  TaskGroupBy,
  KanbanTaskGroup,
  KanbanTaskGroupName,
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
  reOrderKanbanTasks,
  updateTask,
} from "@/features/task/taskSlice";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UNDO_TASK_ACTION } from "@/constants/task";
import { ReactSortable } from "react-sortablejs";
import KanbanTask from "./components/KanbanTask";
import BulkActionsDropdown from "../../../bulk-actions-dropdown/BulkActionsDropdown";
import DeleteTaskModal from "../../../delete-task-modal/DeleteTaskModal";
import { orderKanbanTask } from "@/utils/task";
import { MotionDiv } from "@/components/icon-button/Motion";

type Props = {
  group: KanbanTaskGroup;
  groupBy: TaskGroupBy;
  order?: KanbanOrder;
};

const TaskGroupKanban: React.FC<Props> = ({ group, groupBy, order }) => {
  const dispatch = useDispatch();

  const [isSaveTaskModalOpen, setIsSaveTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>();
  const [createTaskPriority, setCreateTaskPriority] = useState<TaskPriority>();

  const [taskToUpdate, setTaskToUpdate] = useState<Task>();
  const [bulkActionTaskIDs, setBulkActionTaskIDs] = useState<number[]>([]);

  const { name: groupName, tasks } = group;

  const orderedTasks = orderKanbanTask(tasks, groupBy, groupName, order);

  const [lastAddedTaskID, setLastAddedTaskID] = useState<number>();

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
      orderedTasks.length === bulkActionTaskIDs.length &&
      bulkActionTaskIDs.length > 0
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
      setBulkActionTaskIDs(orderedTasks.map((task) => task.id));
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
      className="flex flex-col flex-shrink-0 w-[300px] h-[calc(100dvh-135px)] bg-muted dark:bg-gray rounded-md"
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
          <span className="text-muted-foreground">({orderedTasks.length})</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateTaskModalOpen}
            variant="outline"
            size="sm"
            aria-label={`Add new task to ${groupName}`}
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
                variant="outline"
                size="sm"
                aria-label={`Bulk actions for ${groupName}`}
              >
                <MoreHorizontalIcon />
              </Button>
            </BulkActionsDropdown>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full rounded-sm p-3 pt-0 overflow-y-auto">
        <ReactSortable
          list={orderedTasks.map((t) => {
            // Returning a copy of each task because ReactSortable adds a new "chosen" field directly to each
            // (took a bit of not so pleasant debugging to realize this, lol).
            // We don't want it modifying the original tasks as they are not extensible (leads to runtime error).
            return { ...t };
          })}
          setList={(newTaskList, sortable) => {
            if (!sortable) return;

            const newGroupName = sortable.el
              .closest("[data-group-name]")
              ?.getAttribute("data-group-name") as
              | KanbanTaskGroupName
              | null
              | undefined;

            if (!newGroupName) return;

            const oldOrder = orderedTasks.map((task) => task.id);
            const newOrder = newTaskList.map((task) => task.id);

            const oldTaskListString = JSON.stringify(oldOrder);
            const newTaskListString = JSON.stringify(newOrder);

            if (oldTaskListString === newTaskListString) {
              return;
            }

            if (oldOrder.length > newOrder.length) {
              // Because setList is fired for both columns involved
              // We only need to handle the case where the task is added to the column (newOrder > oldOrder)
              // This is to prevent redundant task re-ordering and state history changes.
              return;
            }

            // Getting the task IDs of tasks that are being moved into this column (lastAddedTaskIDs)
            // This should contain just one ID since we're only moving one task at a time
            // (bulk drag and drop was very finicky to get working and since there was a bulk action dropdown that could do this, I decided to let go of it)
            // Using Set for efficiency
            const lastAddedTaskIDs = newOrder.filter(
              (num) => !new Set(oldOrder).has(num)
            );

            if (lastAddedTaskIDs.length > 0) {
              console.log("lastAddedTaskIDs", lastAddedTaskIDs);
              setLastAddedTaskID(lastAddedTaskIDs[0]);
            }

            const tasksToUpdate: Task[] = [];

            newTaskList.forEach((task) => {
              if (groupBy === "status" && task.status !== newGroupName) {
                const updatedTask = {
                  ...task,
                  status: newGroupName as TaskStatus,
                };
                tasksToUpdate.push(updatedTask);
              } else if (
                groupBy === "priority" &&
                task.priority !== newGroupName
              ) {
                const updatedTask = {
                  ...task,
                  priority: newGroupName as TaskPriority,
                };
                tasksToUpdate.push(updatedTask);
              }
            });

            dispatch(
              reOrderKanbanTasks({
                tasksToUpdate,
                newOrder,
                groupBy,
                groupName: newGroupName,
              })
            );
          }}
          animation={200}
          group={{ name: "shared", pull: true, put: true }}
          className="flex-1"
          swap={true}
        >
          {orderedTasks.map((task, index) => {
            const isChecked = bulkActionTaskIDs.includes(task.id);

            if (task.id === lastAddedTaskID) {
              // This is the task that was just added to the column
              // We don't want the motion animation applied to it. Trust me, we don't.
              return (
                <KanbanTask
                  key={task.id}
                  task={task}
                  groupBy={groupBy}
                  isChecked={isChecked}
                  onCheckedChange={() => handleToggleTaskSelection(task.id)}
                  onEdit={handleUpdateTaskModalOpen}
                  onDuplicate={handleDuplicateTask}
                  onDelete={handleShowDeleteTaskModal}
                />
              );
            }

            return (
              <MotionDiv
                key={task.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <KanbanTask
                  task={task}
                  groupBy={groupBy}
                  isChecked={isChecked}
                  onCheckedChange={() => handleToggleTaskSelection(task.id)}
                  onEdit={handleUpdateTaskModalOpen}
                  onDuplicate={handleDuplicateTask}
                  onDelete={handleShowDeleteTaskModal}
                />
              </MotionDiv>
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

export default TaskGroupKanban;
