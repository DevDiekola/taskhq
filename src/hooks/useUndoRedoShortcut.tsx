import { redoAction, undoAction } from "@/store/reducers/history";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "./use-toast";

const useUndoRedoShortcut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      // Don't freak out lol... this is code jargons for CTRL+Z (Windows) or COMMAND+Z (MacOS)
      const isUndo =
        (e.ctrlKey && e.key.toLowerCase() === "z") ||
        (e.metaKey && !e.shiftKey && e.key.toLowerCase() === "z");

      // Code talk for CTRL+Y (Windows) or COMMAND+SHIFT+Z (MacOS)
      const isRedo =
        (e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z");

      if (isUndo) {
        dispatch(undoAction);
        toast({
          title: "Undo successful",
        });
      } else if (isRedo) {
        dispatch(redoAction);
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
