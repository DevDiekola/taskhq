import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyTasks from "./pages/my-tasks/MyTasks";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/my-tasks" replace />} />
          <Route path="/my-tasks" element={<MyTasks />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
