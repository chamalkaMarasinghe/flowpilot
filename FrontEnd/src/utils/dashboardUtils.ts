import {
  addDays,
  endOfDay,
  format,
  isToday,
  isTomorrow,
  isWithinInterval,
  parseISO,
  startOfDay,
  subMonths,
} from "date-fns";
import type { ActivityLog, Task, TaskStatus, User } from "@/types";
import { STATUS_LABEL } from "./taskUtils";
import { isOverdue } from "./dateUtils";

export type DashboardPeriod = "today" | "week" | "month" | "all";
export type TaskFocus = "today" | "upcoming";

export const PERIOD_LABEL: Record<DashboardPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  all: "Overview",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  OPEN: "oklch(0.72 0.02 270)",
  IN_PROGRESS: "oklch(0.52 0.22 280)",
  TESTING: "oklch(0.78 0.16 75)",
  DONE: "oklch(0.66 0.16 155)",
};

export function filterTasksByPeriod(tasks: Task[], period: DashboardPeriod): Task[] {
  if (period === "all") return tasks;

  const now = new Date();
  const end =
    period === "today"
      ? endOfDay(now)
      : period === "week"
        ? endOfDay(addDays(now, 7))
        : endOfDay(addDays(now, 30));

  return tasks.filter((t) => {
    const due = parseISO(t.dueDate);
    if (period === "today") {
      return isToday(due) || (t.status !== "DONE" && isOverdue(t.dueDate));
    }
    return isWithinInterval(due, { start: startOfDay(now), end });
  });
}

export function filterMyTasks(tasks: Task[], userId: string, focus: TaskFocus): Task[] {
  const mine = tasks.filter((t) => t.assignedTo === userId && t.status !== "DONE");

  if (focus === "today") {
    return mine
      .filter((t) => isToday(parseISO(t.dueDate)) || isOverdue(t.dueDate))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  return mine
    .filter((t) => {
      const due = parseISO(t.dueDate);
      return isTomorrow(due) || (!isToday(due) && !isOverdue(t.dueDate));
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6);
}

export function getStatusChartData(tasks: Task[]) {
  const statuses: TaskStatus[] = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];
  return statuses.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    value: tasks.filter((t) => t.status === status).length,
    fill: STATUS_COLORS[status],
  }));
}

export function getTasksTrendData(tasks: Task[]) {
  const months = Array.from({ length: 7 }, (_, i) => subMonths(new Date(), 6 - i));

  return months.map((month) => {
    const key = format(month, "yyyy-MM");
    const label = format(month, "MMM");

    const created = tasks.filter((t) => format(parseISO(t.createdAt), "yyyy-MM") === key).length;
    const completed = tasks.filter(
      (t) => t.status === "DONE" && format(parseISO(t.updatedAt), "yyyy-MM") === key,
    ).length;

    return { label, created, completed };
  });
}

export interface PipelineRow {
  status: TaskStatus;
  label: string;
  count: number;
  percent: number;
  color: string;
}

export function getStatusPipeline(tasks: Task[]): PipelineRow[] {
  const total = tasks.length || 1;
  const statuses: TaskStatus[] = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];

  return statuses.map((status) => {
    const count = tasks.filter((t) => t.status === status).length;
    return {
      status,
      label: STATUS_LABEL[status],
      count,
      percent: Math.round((count / total) * 100),
      color: STATUS_COLORS[status],
    };
  });
}

export function getDueSoonTasks(tasks: Task[], limit = 4) {
  return [...tasks]
    .filter((t) => t.status !== "DONE")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
}

export function getUrgentTasks(tasks: Task[], limit = 4) {
  return [...tasks]
    .filter((t) => t.status !== "DONE" && (t.priority === "HIGH" || isOverdue(t.dueDate)))
    .sort((a, b) => {
      const aScore = (a.priority === "HIGH" ? 2 : 0) + (isOverdue(a.dueDate) ? 3 : 0);
      const bScore = (b.priority === "HIGH" ? 2 : 0) + (isOverdue(b.dueDate) ? 3 : 0);
      return bScore - aScore || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, limit);
}

export function getCompletionRate(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.status === "DONE").length / tasks.length) * 100);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function activityUserName(users: User[], userId: string) {
  return users.find((u) => u.id === userId)?.fullName ?? "Someone";
}

export function recentActivity(logs: ActivityLog[], limit = 5) {
  return [...logs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
