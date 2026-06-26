import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ActivityLog, Task, User } from "@/types";
import { DashboardPanel } from "./DashboardPanel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { activityUserName, initials } from "@/utils/dashboardUtils";
import { fromNow, fmtDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

interface Props {
  urgentTasks: Task[];
  activity: ActivityLog[];
  users: User[];
}

export function PriorityFeedPanel({ urgentTasks, activity, users }: Props) {
  return (
    <DashboardPanel title="Needs attention">
      {urgentTasks.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
            Urgent tasks
          </p>
          <ul className="space-y-2.5">
            {urgentTasks.map((task) => {
              const assignee = users.find((u) => u.id === task.assignedTo);
              const overdue = isOverdue(task.dueDate);
              return (
                <li key={task.id}>
                  <Link
                    to="/tasks/$id"
                    params={{ id: task.id }}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
                  >
                    <Avatar className="size-9 ring-2 ring-card">
                      <AvatarFallback className="bg-brand-gradient text-[10px] font-semibold text-white">
                        {initials(assignee?.fullName ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{task.title}</p>
                      <p className={cn("text-xs", overdue ? "text-destructive" : "text-muted-foreground")}>
                        {assignee?.fullName ?? "Unassigned"}
                        {overdue ? " · Overdue" : task.priority === "HIGH" ? " · High priority" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary group-hover:border-primary/40 group-hover:bg-primary/10">
                      Open
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
          Recent activity
        </p>
        <ul className="space-y-3">
          {activity.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <div className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-gradient" />
              <div className="min-w-0">
                <p className="leading-snug text-foreground">
                  <span className="font-medium">{activityUserName(users, item.userId)}</span>{" "}
                  <span className="text-muted-foreground">{item.message}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{fromNow(item.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/kanban"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Open kanban board <ArrowUpRight className="size-3" />
      </Link>
    </DashboardPanel>
  );
}
