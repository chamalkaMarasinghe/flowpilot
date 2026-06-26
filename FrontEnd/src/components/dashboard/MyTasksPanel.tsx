import { Link } from "@tanstack/react-router";
import { Plus, ArrowUpRight } from "lucide-react";
import type { Task, User } from "@/types";
import type { TaskFocus } from "@/utils/dashboardUtils";
import { DashboardPanel } from "./DashboardPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isOverdue, fmtDate } from "@/utils/dateUtils";
import { CheckCircle2, Circle, Flame, Flag } from "lucide-react";

interface Props {
  tasks: Task[];
  users: User[];
  focus: TaskFocus;
  onFocusChange: (focus: TaskFocus) => void;
}

const PRIORITY_SURFACE: Record<Task["priority"], string> = {
  HIGH: "border-destructive/15 bg-gradient-to-br from-destructive/[0.07] to-destructive/[0.02]",
  MEDIUM: "border-info/15 bg-gradient-to-br from-info/[0.08] to-info/[0.02]",
  LOW: "border-success/15 bg-gradient-to-br from-success/[0.08] to-success/[0.02]",
};

const PRIORITY_ICON: Record<Task["priority"], typeof Flame> = {
  HIGH: Flame,
  MEDIUM: Flag,
  LOW: Circle,
};

export function MyTasksPanel({ tasks, users, focus, onFocusChange }: Props) {
  return (
    <DashboardPanel
      title="My tasks"
      className="h-full"
      action={
        <Link to="/tasks/new">
          <Button size="icon" variant="outline" className="size-8 rounded-full border-primary/20 text-primary hover:bg-primary/10 hover:text-primary" aria-label="New task">
            <Plus className="size-4" />
          </Button>
        </Link>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["today", "upcoming"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onFocusChange(key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              focus === key
                ? "bg-brand-gradient text-white shadow-elegant"
                : "bg-primary/8 text-primary hover:bg-primary/12",
            )}
          >
            {key === "today" ? "Today" : "Upcoming"}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-12 text-center">
          <CheckCircle2 className="mb-2 size-8 text-success/70" />
          <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
          <p className="mt-1 text-xs text-muted-foreground">No tasks for this view</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const Icon = PRIORITY_ICON[task.priority];
            const assignee = users.find((u) => u.id === task.assignedTo);
            const overdue = isOverdue(task.dueDate);

            return (
              <li key={task.id}>
                <Link
                  to="/tasks/$id"
                  params={{ id: task.id }}
                  className={cn(
                    "group block rounded-xl border p-4 transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    PRIORITY_SURFACE[task.priority],
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
                          {task.title}
                        </h3>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span>{assignee?.fullName ?? "Unassigned"}</span>
                        <span className={cn(overdue && "font-medium text-destructive")}>
                          {fmtDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to="/tasks"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        View all tasks <ArrowUpRight className="size-3" />
      </Link>
    </DashboardPanel>
  );
}
