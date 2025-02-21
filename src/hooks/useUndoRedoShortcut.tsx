import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "./use-toast";
import { REDO_TASK_ACTION, UNDO_TASK_ACTION } from "@/constants/task";

const useUndoRedoShortcut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't freak out lol... this is code jargons for CTRL+Z (Windows) or COMMAND+Z (MacOS)
      const isUndo =
        (e.ctrlKey && e.key.toLowerCase() === "z") ||
        (e.metaKey && !e.shiftKey && e.key.toLowerCase() === "z");

      // Code talk for CTRL+Y (Windows) or COMMAND+SHIFT+Z (MacOS)
      const isRedo =
        (e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z");

      if (isUndo) {
        e.preventDefault();

        dispatch(UNDO_TASK_ACTION);
        toast({
          title: "Undo successful",
        });
      } else if (isRedo) {
        e.preventDefault();

        dispatch(REDO_TASK_ACTION);
        toast({
          title: "Redo successful",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
};

export default useUndoRedoShortcut;
