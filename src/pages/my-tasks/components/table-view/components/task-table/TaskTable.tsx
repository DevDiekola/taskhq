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
import {
  BarChartIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Paginator from "../paginator/Paginator";
import { useState } from "react";
import { snakeCaseToTitleCase } from "@/utils/string";
import TaskActions from "../../../task-actions/TaskActions";
import CreateUpdateTaskModal from "@/pages/my-tasks/components/create-task-modal/CreateUpdateTaskModal";
import { useDispatch } from "react-redux";
import {
  bulkDeleteTasks,
  bulkSetTaskPriority,
  bulkSetTaskStatus,
  createTask,
  setTableSort,
  updateTask,
} from "@/features/task/taskSlice";
import DeleteTaskModal from "../../../delete-task-modal/DeleteTaskModal";
import TaskTableHead from "./components/TaskTableHead";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { undoAction } from "@/store/reducers/history";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";

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
  const [bulkActionTaskIDs, setBulkActionTaskIDs] = useState<number[]>([]);

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

  const handleShowDeleteTaskModal = (taskIDs: number[]) => {
    setBulkActionTaskIDs(taskIDs);
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
          onClick={() => dispatch(undoAction)}
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
      setBulkActionTaskIDs([
        ...bulkActionTaskIDs,
        ...tasks.map((task) => task.id),
      ]);
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
    <div data-group-id={groupID} className="px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-7 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-[18px]">
              {snakeCaseToTitleCase(groupName)}
            </span>
            <span className="text-muted-foreground">({tasks.length})</span>
          </div>
          <IconButton onClick={() => handleCreateTaskModalOpen()}>
            <PlusIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">Create new task</span>
          </IconButton>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger disabled={bulkActionTaskIDs.length < 1}>
            <Button variant="secondary" disabled={bulkActionTaskIDs.length < 1}>
              Bulk actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BarChartIcon />
                  <span>Set status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {TASK_STATUSES.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleBulkSetTaskStatus(status)}
                      >
                        <span>{snakeCaseToTitleCase(status)}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BarChartIcon />
                  <span>Set priority</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <DropdownMenuItem
                        key={priority}
                        onClick={() => handleBulkSetTaskPriority(priority)}
                      >
                        <span className="capitalize">{priority}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleShowDeleteTaskModal(bulkActionTaskIDs)}
              className="text-red-500"
            >
              <Trash2Icon />
              <span>Bulk delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>
              {/* Only using the checkbox from shadcn for the uniform look.
              I'm not too lazy to write an HTML input checkbox 😭💀 */}
              <Checkbox
                checked={getIsWholeGroupSelected()}
                onCheckedChange={() => handleToggleGroupSelection()}
              />
            </TableHead>
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
          {paginatedTasks.map((task) => (
            <TableRow key={task.id} className="cursor-pointer">
              <TableCell>
                <Checkbox
                  checked={bulkActionTaskIDs.includes(task.id)}
                  onCheckedChange={() => handleToggleTaskSelection(task.id)}
                />
              </TableCell>
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
              <TableCell>
                <TaskActions
                  task={task}
                  onEdit={handleUpdateTaskModalOpen}
                  onDuplicate={handleDuplicateTask}
                  onDelete={(task) => handleShowDeleteTaskModal([task.id])}
                >
                  <IconButton>
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
        </TableBody>
      </Table>
      {bulkActionTaskIDs.length > 0 && (
        <p className="mt-3">
          Selected {bulkActionTaskIDs.length} of {tasks.length} tasks
        </p>
      )}
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

export default TaskTable;
