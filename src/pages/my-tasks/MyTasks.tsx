import { JSX, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ViewID } from "./components/navbar/models/navbarModel";
import TableView from "./components/table-view/TableView";
import KanbanView from "./components/kanban-view/KanbanView";
import Navbar from "./components/navbar/Navbar";
import CalendarView from "./components/calendar-view/CalendarView";

const MyTasks = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const viewID = queryParams.get("view");

  const [activeViewID, setActiveViewID] = useState<ViewID>("table");

  useEffect(() => {
    if (viewID) {
      setActiveViewID(viewID as ViewID);
    }
  }, [viewID]);

  const viewPages: Record<ViewID, JSX.Element> = {
    table: <TableView />,
    kanban: <KanbanView />,
    calendar: <CalendarView />,
  };

  return (
    <div>
      <Navbar />
      {viewPages[activeViewID] || <h3>Ooops, wrong page</h3>}
    </div>
  );
};

export default MyTasks;
