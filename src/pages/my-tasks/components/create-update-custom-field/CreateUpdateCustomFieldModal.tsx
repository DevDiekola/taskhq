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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toTitleCase } from "@/utils/string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomField,
  CustomFieldPayload,
  CustomFieldType,
} from "@/features/task/taskModel";
import { CUSTOM_FIELD_TYPES } from "@/constants/task";

const customFieldSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.string().min(1),
});

type CustomFieldSchema = z.infer<typeof customFieldSchema>;

type Props = {
  isOpen: boolean;
  customField?: CustomField;
  onSubmit: (customFieldPayload: CustomFieldPayload) => void;
  onClose: () => void;
};

const CreateUpdateCustomFieldModal: React.FC<Props> = ({
  isOpen,
  customField,
  onSubmit,
  onClose,
}) => {
  const form = useForm<CustomFieldSchema>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      name: customField?.name ?? "",
      type: customField?.type ?? "text",
    },
  });

  const handleSubmit = ({ name, type }: CustomFieldSchema) => {
    const customFieldPayload: CustomFieldPayload = {
      id: customField?.id,
      name: name,
      type: type as CustomFieldType,
    };

    onSubmit(customFieldPayload);
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
                {customField?.id
                  ? "Update custom field"
                  : "Create new custom field"}
              </DialogTitle>
              <DialogDescription>
                Custom fields help you add additional information to your tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-[7]">
                    <FormLabel>Field name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter field title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!customField && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-[3]">
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CUSTOM_FIELD_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {toTitleCase(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className="justify-end">
              <Button onClick={onClose} variant="ghost" type="button">
                Cancel
              </Button>
              <Button type="submit">Create custom field</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateCustomFieldModal;
