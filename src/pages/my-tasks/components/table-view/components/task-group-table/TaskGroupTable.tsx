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
  TaskPayload,
  TaskPriority,
  TaskStatus,
  TaskGroupBy,
  TaskSortColumn,
  TaskSortOrder,
  TableTaskGroup,
  CustomField,
  CustomFieldPayload,
} from "@/features/task/taskModel";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import Paginator from "../paginator/Paginator";
import { useState } from "react";
import { toTitleCase } from "@/utils/string";
import CreateUpdateTaskModal from "@/pages/my-tasks/components/create-update-task-modal/CreateUpdateTaskModal";
import { useDispatch } from "react-redux";
import {
  bulkDeleteTasks,
  bulkSetTaskPriority,
  bulkSetTaskStatus,
  createCustomField,
  createTask,
  deleteCustomField,
  setTableSort,
  updateCustomField,
  updateTask,
} from "@/features/task/taskSlice";
import DeleteTaskModal from "../../../delete-task-modal/DeleteTaskModal";
import TaskTableHead from "./components/table-task-head/TaskTableHead";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UNDO_TASK_ACTION } from "@/constants/task";
import TableTask from "./components/table-task/TableTask";
import BulkActionsDropdown from "../../../bulk-actions-dropdown/BulkActionsDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateUpdateCustomFieldModal from "../../../create-update-custom-field/CreateUpdateCustomFieldModal";
import { useAppSelector } from "@/hooks/useAppSelector";
import DeleteCustomFieldModal from "../../../delete-custom-field-modal/DeleteCustomFieldModal";

type Props = {
  group: TableTaskGroup;
  groupBy?: TaskGroupBy;
  sortColumn?: TaskSortColumn;
  sortOrder?: TaskSortOrder;
  defaultCurrentPage?: number;
  defaultPageSize?: number;
};

const TaskGroupTable: React.FC<Props> = ({
  group,
  groupBy,
  sortColumn,
  sortOrder,
  defaultCurrentPage = 1,
  defaultPageSize = 10,
}) => {
  const { customFields } = useAppSelector((state) => state.taskState.present);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [isSaveTaskModalOpen, setIsSaveTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  const [isSaveFieldModalOpen, setIsSaveFieldModalOpen] = useState(false);
  const [isDeleteFieldModalOpen, setIsDeleteFieldModalOpen] = useState(false);

  const [fieldToUpdate, setFieldToUpdate] = useState<CustomField>();
  const [fieldToDelete, setFieldToDelete] = useState<CustomField>();

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>();
  const [createTaskPriority, setCreateTaskPriority] = useState<TaskPriority>();

  const [taskToUpdate, setTaskToUpdate] = useState<Task>();
  const [bulkActionTaskIDs, setBulkActionTaskIDs] = useState<number[]>([]);

  const { name: groupName, tasks } = group;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);

  const handleSort = (newSortColumn: TaskSortColumn) => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
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

  const handleCreateFieldModalOpen = () => {
    setIsSaveFieldModalOpen(true);
  };

  const handleUpdateTaskModalOpen = (task: Task) => {
    setTaskToUpdate(task);
    setIsSaveTaskModalOpen(true);
  };

  const handleUpdateFieldModalOpen = (customField: CustomField) => {
    setFieldToUpdate(customField);
    setIsSaveFieldModalOpen(true);
  };

  const handleDeleteFieldModalOpen = (customField: CustomField) => {
    setFieldToDelete(customField);
    setIsDeleteFieldModalOpen(true);
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

  const handleSaveFieldSubmit = (customFieldPayload: CustomFieldPayload) => {
    setIsSaveFieldModalOpen(false);
    setFieldToUpdate(undefined);

    if (customFieldPayload.id) {
      dispatch(updateCustomField(customFieldPayload));
    } else {
      dispatch(createCustomField(customFieldPayload));
    }
  };

  const handleSaveTaskModalClose = () => {
    setIsSaveTaskModalOpen(false);
    setTaskToUpdate(undefined);
    setCreateTaskStatus(undefined);
    setCreateTaskPriority(undefined);
  };

  const handleSaveFieldModalClose = () => {
    setIsSaveFieldModalOpen(false);
    setFieldToUpdate(undefined);
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

  // const handleShowDeleteFieldModal = (customField: CustomField) => {
  //   setFieldToDelete(customField);
  //   setIsDeleteFieldModalOpen(true);
  // };

  const handleDeleteFieldModalClose = () => {
    setFieldToDelete(undefined);
    setIsDeleteFieldModalOpen(false);
  };

  const handleDeleteField = (customFieldID: number) => {
    dispatch(deleteCustomField(customFieldID));
    setFieldToDelete(undefined);
    setIsDeleteFieldModalOpen(false);

    toast({
      title: "Custom field deleted successfully",
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
    <div className="sm:px-4 sm:py-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-7 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-[18px]">{toTitleCase(groupName)}</span>
            <span className="text-muted-foreground">({tasks.length})</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  aria-label={`Create new task with ${groupName} ${groupBy}`}
                  className="p-1 hover:bg-muted"
                  onClick={handleCreateTaskModalOpen}
                >
                  <PlusIcon size={18} className="text-muted-foreground" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              columnID="title"
              columnName="Title"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSortClick={handleSort}
            />
            {groupBy !== "status" && (
              <TaskTableHead
                columnID="status"
                columnName="Status"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortClick={handleSort}
              />
            )}
            {groupBy !== "priority" && (
              <TaskTableHead
                columnID="priority"
                columnName="Priority"
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortClick={handleSort}
              />
            )}
            {customFields.map((field) => (
              <TaskTableHead
                key={field.id}
                columnID={field.id}
                columnName={field.name}
                customField={field}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortClick={handleSort}
                onEditClick={handleUpdateFieldModalOpen}
                onDeleteClick={handleDeleteFieldModalOpen}
              />
            ))}
            <TableHead>
              <Button onClick={handleCreateFieldModalOpen} variant="ghost">
                <span>Add Field</span>
                <PlusIcon size={18} />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTasks.map((task) => (
            <TableTask
              key={task.id}
              task={task}
              groupBy={groupBy}
              customFields={customFields}
              isChecked={bulkActionTaskIDs.includes(task.id)}
              onCheckedChange={() => handleToggleTaskSelection(task.id)}
              onEdit={handleUpdateTaskModalOpen}
              onUpdate={handleTaskSubmit}
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
          customFields={customFields}
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
      {isSaveFieldModalOpen && (
        <CreateUpdateCustomFieldModal
          isOpen={isSaveFieldModalOpen}
          customField={fieldToUpdate}
          existingCustomFields={customFields}
          onSubmit={handleSaveFieldSubmit}
          onClose={handleSaveFieldModalClose}
        />
      )}
      {isDeleteFieldModalOpen && (
        <DeleteCustomFieldModal
          isOpen={isDeleteFieldModalOpen}
          customField={fieldToDelete!}
          onDelete={handleDeleteField}
          onClose={handleDeleteFieldModalClose}
        />
      )}
    </div>
  );
};

export default TaskGroupTable;
