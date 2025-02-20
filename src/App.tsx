import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/app-layout/AppLayout";
import MyTasks from "./pages/my-tasks/MyTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/my-tasks" element={<MyTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
