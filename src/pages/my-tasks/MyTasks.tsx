import { JSX, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ViewID } from "./components/task-navbar/models/navbarModel";
import TableView from "./components/table-view/TableView";
import KanbanView from "./components/kanban-view/KanbanView";
import useUndoRedoShortcut from "@/hooks/useUndoRedoShortcut";
import TaskNavbar from "./components/task-navbar/TaskNavbar";

const MyTasks = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const viewID = queryParams.get("view");

  const [activeViewID, setActiveViewID] = useState<ViewID>("table");

  // Enables task action undo/redo using keyboard shortcuts
  useUndoRedoShortcut();

  useEffect(() => {
    if (viewID) {
      setActiveViewID(viewID as ViewID);
    }
  }, [viewID]);

  const viewPages: Record<ViewID, JSX.Element> = {
    table: <TableView />,
    kanban: <KanbanView />,
  };

  return (
    <div>
      <TaskNavbar />
      {viewPages[activeViewID] || <h3>Ooops, wrong page</h3>}
    </div>
  );
};

export default MyTasks;
