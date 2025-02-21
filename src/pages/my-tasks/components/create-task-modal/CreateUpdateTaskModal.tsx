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
import { snakeCaseToTitleCase } from "@/utils/string";

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
  defaultPriority = "low",
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
      <DialogContent className="w-[90%] md:w-[700px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col w-full justify-start gap-10"
          >
            <DialogHeader>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status
                    {selectedStatus
                      ? `: ${snakeCaseToTitleCase(selectedStatus)}`
                      : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setSelectedStatus(value as TaskStatus)
                    }
                  >
                    {TASK_STATUSES.map((status) => (
                      <DropdownMenuRadioItem key={status} value={status}>
                        {snakeCaseToTitleCase(status)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Priority{" "}
                    {selectedPriority
                      ? `: ${snakeCaseToTitleCase(selectedPriority)}`
                      : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={selectedPriority}
                    onValueChange={(value) =>
                      setSelectedPriority(value as TaskPriority)
                    }
                  >
                    {TASK_PRIORITIES.map((priority) => (
                      <DropdownMenuRadioItem key={priority} value={priority}>
                        {snakeCaseToTitleCase(priority)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
