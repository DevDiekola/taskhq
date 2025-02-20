import IconButton from "@/components/icon-button/IconButton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { TaskGroup, ViewGroupBy } from "@/features/task/taskModel";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import Paginator from "../paginator/Paginator";
import { useState } from "react";
import { snakeCaseToTitleCase } from "@/utils/string";
import CreateTaskModal from "@/components/create-task-modal/CreateTaskModal";

type Props = {
  group: TaskGroup;
  groupBy?: ViewGroupBy;
};

const TaskTable: React.FC<Props> = ({ group, groupBy = "All" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const { id: groupID, title: groupTitle, tasks } = group;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIndex, startIndex + pageSize);

  return (
    <div data-group-id={groupID} className="px-4 py-3">
      <div className="inline-flex gap-7 justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-[18px]">
            {snakeCaseToTitleCase(groupTitle)}
          </span>
          <span className="text-muted-foreground">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconButton>
            <MoreHorizontalIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">More task actions</span>
          </IconButton>
          <IconButton onClick={() => setIsCreateTaskModalOpen(true)}>
            <PlusIcon size={18} className="text-muted-foreground" />
            <span className="sr-only">Create new task</span>
          </IconButton>
        </div>
      </div>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            {groupBy !== "status" && (
              <TableHead className="w-[200px]">Status</TableHead>
            )}
            {groupBy !== "priority" && (
              <TableHead className="w-[200px]">Priority</TableHead>
            )}
            <TableHead className="text-center">Actions</TableHead>
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
                {/* <TaskAction> */}
                <IconButton className="inline-flex">
                  <MoreHorizontalIcon
                    size={18}
                    className="text-muted-foreground"
                  />
                  <span className="sr-only">More task actions</span>
                </IconButton>
                {/* </TaskAction> */}
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
      {isCreateTaskModalOpen && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          setIsOpen={setIsCreateTaskModalOpen}
        />
      )}
    </div>
  );
};

export default TaskTable;
