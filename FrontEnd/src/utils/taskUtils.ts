import type { DashboardSummary, Task, TaskFilters, TaskPriority, TaskSortKey, TaskStatus } from "@/types";
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

const PRIORITY_RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
const STATUS_RANK = { OPEN: 0, IN_PROGRESS: 1, TESTING: 2, DONE: 3 } as const;

export function filterAndSortTasks(
  tasks: Task[],
  filters: TaskFilters,
  sort: TaskSortKey,
): Task[] {
  let list = tasks;

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }
  if (filters.status && filters.status !== "ALL") {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters.priority && filters.priority !== "ALL") {
    list = list.filter((t) => t.priority === filters.priority);
  }
  if (filters.assignedTo && filters.assignedTo !== "ALL") {
    list = list.filter((t) => t.assignedTo === filters.assignedTo);
  }

  return [...list].sort((a, b) => {
    switch (sort) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "priority":
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      case "status":
        return STATUS_RANK[a.status] - STATUS_RANK[b.status];
    }
  });
}

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
