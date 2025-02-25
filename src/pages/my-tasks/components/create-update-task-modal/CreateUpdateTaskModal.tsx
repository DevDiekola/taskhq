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
  TaskCustomFieldValues,
  CustomField,
} from "@/features/task/taskModel";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";
import { toTitleCase } from "@/utils/string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/number-input/NumberInput";

const taskSchema = z.object({
  title: z.string().min(1).max(300),
  status: z.string(),
  priority: z.string(),
});

type TaskSchema = z.infer<typeof taskSchema>;

type Props = {
  isOpen: boolean;
  task?: Task;
  defaultStatus?: TaskStatus;
  defaultPriority?: TaskPriority;
  customFields: CustomField[];
  onSubmit: (taskPayload: TaskPayload) => void;
  onClose: () => void;
};

const CreateUpdateTaskModal: React.FC<Props> = ({
  isOpen,
  task,
  defaultPriority = "none",
  defaultStatus = "not_started",
  customFields,
  onSubmit,
  onClose,
}) => {
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      status: task?.status ?? defaultStatus,
      priority: task?.priority ?? defaultPriority,
    },
  });

  const [customFieldValues, setCustomFieldValues] = useState<
    Record<number, TaskCustomFieldValues>
  >(task?.customFieldValues ?? {});

  // Couldn't get this to work with react hook form and zod in time,
  // so here goes my hacky solution.
  const handleCustomFieldChange = (
    id: number,
    key: keyof TaskCustomFieldValues,
    value: string | number | boolean | undefined
  ) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleSubmit = ({ title, status, priority }: TaskSchema) => {
    const taskPayload: TaskPayload = {
      id: task?.id,
      title,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      customFieldValues,
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {toTitleCase(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {toTitleCase(priority)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              {customFields.length > 0 && <Label>Custom Fields</Label>}
              {customFields.map((customField) => (
                <div
                  key={customField.id}
                  className="flex justify-between items-center gap-3 mt-3"
                >
                  <div className="flex flex-[3] justify-center items-center rounded-md bg-muted h-10">
                    <Label>{customField.name}</Label>
                  </div>
                  <div className="flex-[7]">
                    {customField.type === "text" && (
                      <Input
                        placeholder={`Enter ${customField.name}`}
                        value={
                          customFieldValues[customField.id]?.textValue ?? ""
                        }
                        onChange={(e) =>
                          handleCustomFieldChange(
                            customField.id,
                            "textValue",
                            e.target.value
                          )
                        }
                      />
                    )}
                    {customField.type === "number" && (
                      <NumberInput
                        placeholder={`Enter ${customField.name}`}
                        value={customFieldValues[customField.id]?.numberValue}
                        onNumberChange={(number) => {
                          handleCustomFieldChange(
                            customField.id,
                            "numberValue",
                            number
                          );
                        }}
                      />
                    )}
                    {customField.type === "checkbox" && (
                      <Checkbox
                        checked={
                          !!customFieldValues[customField.id]?.checkboxValue
                        }
                        onCheckedChange={(checked) =>
                          handleCustomFieldChange(
                            customField.id,
                            "checkboxValue",
                            checked === true
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="justify-end">
              <Button onClick={onClose} variant="ghost" type="button">
                Cancel
              </Button>
              <Button type="submit">Create task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateTaskModal;
