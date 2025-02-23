import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  TaskPayload,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/features/task/taskModel";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import { toTitleCase } from "@/utils/string";
import { ChevronDown } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1).max(100),
});

type TaskSchema = z.infer<typeof taskSchema>;

type Props = {
  isOpen: boolean;
  task?: Task;
  defaultStatus?: TaskStatus;
  defaultPriority?: TaskPriority;
  onSubmit: (taskPayload: TaskPayload) => void;
  onClose: () => void;
};

const CreateUpdateTaskModal: React.FC<Props> = ({
  isOpen,
  task,
  defaultPriority = "none",
  defaultStatus = "not_started",
  onSubmit,
  onClose,
}) => {
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
    },
  });

  const [selectedStatus, setSelectedStatus] = React.useState(
    task?.status ?? defaultStatus
  );
  const [selectedPriority, setSelectedPriority] = React.useState(
    task?.priority ?? defaultPriority
  );

  const handleSubmit = (formData: TaskSchema) => {
    const taskPayload: TaskPayload = {
      id: task?.id,
      title: formData.title,
      status: selectedStatus,
      priority: selectedPriority,
    };

    onSubmit(taskPayload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90%] md:w-[500px] rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col w-full justify-start gap-10"
          >
            <DialogHeader className="text-left">
              <DialogTitle className="text-[20px] font-medium">
                {task?.id ? "Update task" : "Create new task"}
              </DialogTitle>
              <DialogDescription>
                Get things done, one task at a time!
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter task title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-between"
                    >
                      <span>{toTitleCase(selectedStatus)}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-52">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={(value) =>
                        setSelectedStatus(value as TaskStatus)
                      }
                    >
                      {TASK_STATUSES.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {toTitleCase(status)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel>Priority</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-between"
                    >
                      <span>{toTitleCase(selectedPriority)}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-52">
                    <DropdownMenuRadioGroup
                      value={selectedPriority}
                      onValueChange={(value) =>
                        setSelectedPriority(value as TaskPriority)
                      }
                    >
                      {TASK_PRIORITIES.map((priority) => (
                        <DropdownMenuRadioItem key={priority} value={priority}>
                          {toTitleCase(priority)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
            </div>
            <DialogFooter className="justify-end">
              <Button type="submit">Create task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateTaskModal;
