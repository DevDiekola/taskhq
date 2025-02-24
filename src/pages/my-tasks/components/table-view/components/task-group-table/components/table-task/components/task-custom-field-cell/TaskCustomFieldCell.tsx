import { useState, useRef, useEffect } from "react";
import IconButton from "@/components/icon-button/IconButton";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import {
  Task,
  TaskPayload,
  CustomField,
  TaskCustomFieldValues,
} from "@/features/task/taskModel";
import { EditIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import NumberInput from "@/components/number-input/NumberInput";

type Props = {
  task: Task;
  customField: CustomField;
  onUpdate: (taskPayload: TaskPayload) => void;
};

const TaskCustomFieldCell: React.FC<Props> = ({
  task,
  customField,
  onUpdate,
}) => {
  const fieldValues = task.customFieldValues?.[customField.id];

  const [isEditing, setIsEditing] = useState(customField.type === "checkbox");

  const [textValue, setTextValue] = useState<string | undefined>(
    fieldValues?.textValue ?? ""
  );
  const [numberValue, setNumberValue] = useState<number | undefined>(
    fieldValues?.numberValue ?? 0
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && customField.type !== "checkbox") {
      inputRef.current?.focus();
    }
  }, [isEditing, customField.type]);

  const startEditing = () => {
    setIsEditing(true);

    setNumberValue(fieldValues?.numberValue ?? 0);
    setTextValue(fieldValues?.textValue ?? "");
  };

  const saveValue = () => {
    let updatedFieldValue: TaskCustomFieldValues = {};

    if (customField.type === "number") {
      updatedFieldValue = { numberValue: numberValue };
    } else if (customField.type === "text") {
      updatedFieldValue = { textValue: textValue };
    }

    onUpdate({
      ...task,
      customFieldValues: {
        ...task.customFieldValues,
        [customField.id]: updatedFieldValue,
      },
    });

    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveValue();
    } else if (e.key === "Escape") {
      setNumberValue(fieldValues?.numberValue ?? 0);
      setTextValue(fieldValues?.textValue ?? "");

      setIsEditing(false);
    }
  };

  return (
    <TableCell className={isEditing ? "p-2" : ""}>
      <div className="group flex justify-between items-center gap-5 font-medium">
        {customField.type === "checkbox" ? (
          <Checkbox
            // Because we don't need a temp state, we can just use the field value directly
            checked={
              task.customFieldValues?.[customField.id]?.checkboxValue === true
            }
            onCheckedChange={(checked) => {
              onUpdate({
                ...task,
                customFieldValues: {
                  ...task.customFieldValues,
                  [customField.id]: { checkboxValue: checked === true },
                },
              });
            }}
            className="cursor-pointer"
          />
        ) : isEditing ? (
          customField.type === "text" ? (
            <Input
              ref={inputRef}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={saveValue}
              onKeyDown={handleKeyDown}
              className="p-1 border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent"
            />
          ) : (
            <NumberInput
              ref={inputRef}
              value={numberValue}
              onNumberChange={(number) => setNumberValue(number)}
              onBlur={saveValue}
              onKeyDown={handleKeyDown}
              className="p-1 border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent"
            />
          )
        ) : (
          <span onClick={startEditing} className="cursor-pointer w-full">
            {customField.type === "text"
              ? fieldValues?.textValue || "-"
              : fieldValues?.numberValue || "-"}
          </span>
        )}
        {customField.type !== "checkbox" && (
          <IconButton
            onClick={startEditing}
            className="p-1 opacity-0 group-hover:opacity-100 bg-black hover:bg-gray-800 border border-gray-500"
            aria-label="Edit custom field"
          >
            <EditIcon size={18} className="text-muted-foreground" />
          </IconButton>
        )}
      </div>
    </TableCell>
  );
};

export default TaskCustomFieldCell;
