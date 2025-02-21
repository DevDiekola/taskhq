import IconButton from "@/components/icon-button/IconButton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  TableViewSort,
  Task,
  TaskGroup,
  TaskPayload,
  TaskPriority,
  TaskStatus,
  ViewGroupBy,
  ViewSortColumn,
  ViewSortOrder,
} from "@/features/task/taskModel";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import Paginator from "../paginator/Paginator";
import { useState } from "react";
import { toTitleCase } from "@/utils/string";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UNDO_TASK_ACTION } from "@/constants/task";
import TableTask from "./components/TableTask";
import BulkActionsDropdown from "../../../bulk-actions-dropdown/BulkActionsDropdown";

type Props = {
  group: TaskGroup;
  groupBy?: ViewGroupBy;
  sortColumn?: ViewSortColumn;
  sortOrder?: ViewSortOrder;
  defaultCurrentPage?: number;
  defaultPageSize?: number;
};

const TableTaskGroup: React.FC<Props> = ({
  group,
  groupBy,
  sortColumn,
  sortOrder,
  defaultCurrentPage = 1,
  defaultPageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [isSaveTaskModalOpen, setIsSaveTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>();
  const [createTaskPriority, setCreateTaskPriority] = useState<TaskPriority>();

  const [taskToUpdate, setTaskToUpdate] = useState<Task>();
  const [bulkActionTaskIDs, setBulkActionTaskIDs] = useState<number[]>([]);

  const { name: groupName, tasks } = group;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);

  const dispatch = useDispatch();

  const handleSort = (newSortColumn: ViewSortColumn) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const viewSort: TableViewSort = {
      sortColumn: newSortColumn,
      sortOrder: newSortOrder,
    };
    dispatch(setTableSort(viewSort));
  };

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
    <div className="px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-7 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-[18px]">{toTitleCase(groupName)}</span>
            <span className="text-muted-foreground">({tasks.length})</span>
          </div>
          <IconButton onClick={handleCreateTaskModalOpen}>
            <PlusIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">Create new task</span>
          </IconButton>
        </div>
        <BulkActionsDropdown
          taskIDs={bulkActionTaskIDs}
          onSetStatus={handleBulkSetTaskStatus}
          onSetPriority={handleBulkSetTaskPriority}
          onBulkDelete={handleShowDeleteTaskModal}
        >
          <Button variant="secondary">
            <span>Bulk actions</span>
            <ChevronDownIcon />
          </Button>
        </BulkActionsDropdown>
      </div>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>
              {/* Only using the checkbox from shadcn for the uniform look.
              I'm not too lazy to write an HTML input checkbox 😭💀 */}
              <Checkbox
                checked={getIsWholeGroupSelected()}
                onCheckedChange={handleToggleGroupSelection}
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
            <TableTask
              key={task.id}
              task={task}
              groupBy={groupBy}
              isChecked={bulkActionTaskIDs.includes(task.id)}
              onCheckedChange={() => handleToggleTaskSelection(task.id)}
              onEdit={handleUpdateTaskModalOpen}
              onDuplicate={handleDuplicateTask}
              onDelete={handleShowDeleteTaskModal}
            />
          ))}
        </TableBody>
      </Table>
      {bulkActionTaskIDs.length > 0 && (
        <p className="mt-7">
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

export default TableTaskGroup;
