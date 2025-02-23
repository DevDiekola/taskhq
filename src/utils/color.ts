import { PRIORITY_CLASS_NAMES, STATUS_CLASS_NAMES } from "@/constants/task";
import { TaskPriority, TaskStatus } from "@/features/task/taskModel"

export const getStatusClassNames = (
    status: TaskStatus
): { background: string; foreground: string } => {
    return STATUS_CLASS_NAMES[status] ?? { background: 'bg-gray-200', foreground: 'text-gray-800' };
};

export const getPriorityClassNames = (
    priority: TaskPriority
): { background: string; foreground: string } => {
    return PRIORITY_CLASS_NAMES[priority] ?? { background: 'bg-gray-200', foreground: 'text-gray-800' };
};