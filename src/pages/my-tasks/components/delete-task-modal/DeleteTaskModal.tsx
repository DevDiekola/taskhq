import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Prop = {
  isOpen: boolean;
  taskIDs: number[];
  onDelete: (taskIDs: number[]) => void;
  onClose: () => void;
};

const DeleteTaskModal: React.FC<Prop> = ({
  isOpen,
  taskIDs,
  onDelete,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete{" "}
            {taskIDs.length > 1 ? "these tasks" : "this task"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You might lose {taskIDs.length > 1 ? "them" : "it"} permanently!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onDelete(taskIDs)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;
