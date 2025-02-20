import IconButton from "@/components/icon-button/IconButton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Task,
  TaskGroup,
  TaskPayload,
  TaskPriority,
  TaskStatus,
  ViewGroupBy,
  ViewSort,
  ViewSortColumn,
  ViewSortOrder,
} from "@/features/task/taskModel";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import Paginator from "../paginator/Paginator";
import { useState } from "react";
import { snakeCaseToTitleCase } from "@/utils/string";
import TaskActions from "../../../task-actions/TaskActions";
import CreateUpdateTaskModal from "@/pages/my-tasks/components/create-task-modal/CreateUpdateTaskModal";
import { useDispatch } from "react-redux";
import {
  createTask,
  deleteTask,
  setTableSort,
  updateTask,
} from "@/features/task/taskSlice";
import DeleteTaskModal from "../../../delete-task-modal/DeleteTaskModal";
import TaskTableHead from "./components/TaskTableHead";

type Props = {
  group: TaskGroup;
  groupBy?: ViewGroupBy;
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
};

const TaskTable: React.FC<Props> = ({
  group,
  groupBy,
  sortColumn,
  sortOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isSaveTaskModalOpen, setIsSaveTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>();
  const [createTaskPriority, setCreateTaskPriority] = useState<TaskPriority>();

  const [taskToUpdate, setTaskToUpdate] = useState<Task>();
  const [taskToDelete, setTaskToDelete] = useState<Task>();

  const { id: groupID, name: groupName, tasks } = group;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);

  const dispatch = useDispatch();

  const handleSort = (newSortColumn: ViewSortColumn) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const viewSort: ViewSort = {
      sortColumn: newSortColumn,
      sortOrder: newSortOrder,
    };
    dispatch(setTableSort(viewSort));
  };

  const handleCreateTaskModalOpen = () => {
    if (groupBy === "status") {
      setCreateTaskStatus(group.name as TaskStatus);
    } else if (groupBy === "priority") {
      setCreateTaskPriority(group.name as TaskPriority);
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

  const handleShowDeleteTaskModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    dispatch(deleteTask(task.id));
    setTaskToDelete(undefined);
    setIsDeleteTaskModalOpen(false);
  };

  const handleDeleteTaskModalClose = () => {
    setTaskToDelete(undefined);
    setIsDeleteTaskModalOpen(false);
  };

  return (
    <div data-group-id={groupID} className="px-4 py-3">
      <div className="inline-flex gap-7 justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-[18px]">{snakeCaseToTitleCase(groupName)}</span>
          <span className="text-muted-foreground">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconButton>
            <MoreHorizontalIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">More task actions</span>
          </IconButton>
          <IconButton onClick={() => handleCreateTaskModalOpen()}>
            <PlusIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">Create new task</span>
          </IconButton>
        </div>
      </div>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TaskTableHead
              column="title"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onClick={() => handleSort("title")}
            />
            {groupBy !== "status" && (
              <TaskTableHead
                column="status"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onClick={() => handleSort("status")}
              />
            )}
            {groupBy !== "priority" && (
              <TaskTableHead
                column="priority"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onClick={() => handleSort("priority")}
              />
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <ReactSortable
          list={group.tasks.map((t) => {
            return { ...t };
          })}
          setList={(newTasks, sortable) => {
            if (!sortable) {
              return;
            }
            const newGroupIDString = sortable.el
              .closest("[data-group-id]")
              ?.getAttribute("data-group-id");
            if (!newGroupIDString) {
              return;
            }
            const newGroupID = parseInt(newGroupIDString, 10);
            setTaskGroups((prevGroups) =>
              prevGroups.map((group) => {
                if (group.id === newGroupID) {
                  return group;
                }
                return {
                  ...group,
                  tasks: group.tasks.filter(
                    (task) =>
                      !newTasks.some((newTask) => newTask.id === task.id)
                  ),
                };
              })
            );
          }}
          animation={200}
          group={{ name: "shared", pull: true, put: true }}
          ghostClass="sortable-ghost"
          dragClass="sortable-drag"
          tag={TableBody}
          className="connect-sorting-content"
        > */}
          {paginatedTasks.map((task) => (
            <TableRow key={task.id} className="cursor-pointer">
              <TableCell className="font-medium">{task.title}</TableCell>
              {groupBy !== "status" && (
                <TableCell className="items-center justify-center">
                  {snakeCaseToTitleCase(task.status || "")}
                </TableCell>
              )}
              {groupBy !== "priority" && (
                <TableCell className="items-center justify-center">
                  {snakeCaseToTitleCase(task.priority || "")}
                </TableCell>
              )}
              <TableCell className="text-center">
                <TaskActions
                  task={task}
                  onEdit={handleUpdateTaskModalOpen}
                  onDuplicate={handleDuplicateTask}
                  onDelete={handleShowDeleteTaskModal}
                >
                  <IconButton className="inline-flex">
                    <MoreHorizontalIcon
                      size={18}
                      className="text-muted-foreground"
                    />
                    <span className="sr-only">Task actions</span>
                  </IconButton>
                </TaskActions>
              </TableCell>
            </TableRow>
          ))}
          {/* </ReactSortable> */}
        </TableBody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalItems={tasks.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        className="mt-7"
      />
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
      {isDeleteTaskModalOpen && taskToDelete && (
        <DeleteTaskModal
          isOpen={isDeleteTaskModalOpen}
          task={taskToDelete}
          onDelete={handleDeleteTask}
          onClose={handleDeleteTaskModalClose}
        />
      )}
    </div>
  );
};

export default TaskTable;
