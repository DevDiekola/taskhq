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
import { TaskPriority, TaskStatus } from "@/features/task/taskModel";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import { snakeCaseToTitleCase } from "@/utils/string";
import { useDispatch } from "react-redux";
import { createTask } from "@/features/task/taskSlice";

const taskSchema = z.object({
  title: z.string().min(1).max(100),
});

type TaskSchema = z.infer<typeof taskSchema>;

type Props = {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  status?: TaskStatus;
  priority?: TaskPriority;
};

const CreateTaskModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  status,
  priority,
}) => {
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
    },
  });

  const [selectedStatus, setSelectedStatus] = React.useState(status);
  const [selectedPriority, setSelectedPriority] = React.useState(priority);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      createTask({
        title: form.getValues().title,
        status: selectedStatus,
        priority: selectedPriority,
      })
    );

    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen && setIsOpen(open)}>
      <DialogContent className="w-[90%] md:w-[700px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col w-full justify-start gap-10"
          >
            <DialogHeader>
              <DialogTitle className="text-[20px] font-medium">
                Create new task
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
                    <Input {...field} placeholder="Enter task name" />
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
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                  <DropdownMenuLabel>Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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

export default CreateTaskModal;
