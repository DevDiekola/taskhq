import { JSX } from "react";
import { useLocation } from "react-router-dom";
import TableView from "./components/table-view/TableView";
import KanbanView from "./components/kanban-view/KanbanView";
import useUndoRedoShortcut from "@/hooks/useUndoRedoShortcut";
import TaskNavbar from "./components/task-navbar/TaskNavbar";
import { ViewID } from "@/features/task/taskModel";

const MyTasks = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const viewID = queryParams.get("view");

  const activeViewID = viewID === "kanban" ? "kanban" : "table";

  // Enables task action undo/redo using keyboard shortcuts
  useUndoRedoShortcut();

  const viewPages: Record<ViewID, JSX.Element> = {
    table: <TableView />,
    kanban: <KanbanView />,
  };

  return (
    <div>
      <TaskNavbar />
      {viewPages[activeViewID]}
    </div>
  );
};

export default MyTasks;
