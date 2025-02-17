import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Project from "./pages/my-tasks/MyTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Project />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
