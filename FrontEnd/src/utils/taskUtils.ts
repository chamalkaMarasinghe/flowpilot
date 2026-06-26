import type { DashboardSummary, Task, TaskPriority, TaskStatus } from "@/types";
import { isOverdue } from "./dateUtils";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing",
  DONE: "Done",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const ALL_STATUSES: TaskStatus[] = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];
export const ALL_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export function computeSummary(tasks: Task[], currentUserId?: string): DashboardSummary {
  return {
    totalTasks: tasks.length,
    openTasks: tasks.filter((t) => t.status === "OPEN").length,
    inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    testingTasks: tasks.filter((t) => t.status === "TESTING").length,
    doneTasks: tasks.filter((t) => t.status === "DONE").length,
    overdueTasks: tasks.filter((t) => t.status !== "DONE" && isOverdue(t.dueDate)).length,
    assignedToMe: currentUserId ? tasks.filter((t) => t.assignedTo === currentUserId).length : 0,
    highPriorityTasks: tasks.filter((t) => t.priority === "HIGH").length,
  };
}
