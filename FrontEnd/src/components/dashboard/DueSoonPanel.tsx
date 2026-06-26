import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import type { Task } from "@/types";
import { DashboardPanel } from "./DashboardPanel";
import { fmtDate, isOverdue } from "@/utils/dateUtils";
import { STATUS_LABEL } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
}

export function DueSoonPanel({ tasks }: Props) {
  return (
    <DashboardPanel
      title="Due soon"
      action={
        <Link to="/tasks" className="text-xs font-medium text-primary hover:underline">
          See all
        </Link>
      }
    >
      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No upcoming deadlines</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate);
            return (
              <li key={task.id}>
                <Link
                  to="/tasks/$id"
                  params={{ id: task.id }}
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-background text-center shadow-sm">
                    <CalendarClock className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{STATUS_LABEL[task.status]}</p>
                    <p className={cn("mt-1 text-xs font-medium", overdue ? "text-destructive" : "text-muted-foreground")}>
                      {overdue ? "Overdue · " : "Due "}
                      {fmtDate(task.dueDate)}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardPanel>
  );
}
