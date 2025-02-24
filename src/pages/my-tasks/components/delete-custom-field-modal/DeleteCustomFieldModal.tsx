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
import { CustomField } from "@/features/task/taskModel";

type Prop = {
  isOpen: boolean;
  customField: CustomField;
  onDelete: (customFieldID: number) => void;
  onClose: () => void;
};

const DeleteCustomFieldModal: React.FC<Prop> = ({
  isOpen,
  customField,
  onDelete,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete custom field - {customField.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[16px]">
            You might lose it permanently!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onDelete(customField.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCustomFieldModal;
