import type { Task, User } from "@/types";
import { Card } from "@/components/ui/card";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { fmtDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  task: Task;
  users: User[];
  interactive?: boolean;
  isDragPreview?: boolean;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function TaskCard({ task, users, interactive = true, isDragPreview = false }: Props) {
  const assignee = users.find((u) => u.id === task.assignedTo);
  const overdue = task.status !== "DONE" && isOverdue(task.dueDate);
  const card = (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition-all duration-200",
        interactive && !isDragPreview && "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg",
        isDragPreview && "pointer-events-none border-primary/30 shadow-2xl ring-2 ring-primary/20",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
          {task.title}
        </h3>
        <TaskPriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {task.description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TaskStatusBadge status={task.status} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5",
              overdue && "bg-destructive/10 font-medium text-destructive",
            )}
          >
            <CalendarDays className="size-3.5" /> {fmtDate(task.dueDate)}
          </span>
          {assignee && (
            <Avatar className="size-6 ring-2 ring-card" title={assignee.fullName}>
              <AvatarFallback className="bg-brand-gradient text-[10px] font-semibold text-white">
                {initials(assignee.fullName)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </Card>
  );

  if (!interactive) return card;

  return (
    <Link to="/tasks/$id" params={{ id: task.id }} className="block">
      {card}
    </Link>
  );
}
