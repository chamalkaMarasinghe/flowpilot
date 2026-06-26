import type { Task, User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { Link, useNavigate } from "@tanstack/react-router";
import { fmtDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  tasks: Task[];
  users: User[];
  onDelete?: (id: string) => void;
  canEdit?: (task: Task) => boolean;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function TaskTable({ tasks, users, onDelete, canEdit }: Props) {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Priority
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assignee
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Due date
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const assignee = users.find((u) => u.id === task.assignedTo);
            const overdue = task.status !== "DONE" && isOverdue(task.dueDate);
            const editable = canEdit ? canEdit(task) : true;
            return (
              <TableRow
                key={task.id}
                onClick={() => navigate({ to: "/tasks/$id", params: { id: task.id } })}
                className="cursor-pointer transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
              >
                <TableCell className="max-w-xs py-3.5">
                  <Link
                    to="/tasks/$id"
                    params={{ id: task.id }}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {task.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <TaskPriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-brand-gradient text-[10px] font-semibold text-white">
                          {initials(assignee.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignee.fullName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm",
                      overdue
                        ? "bg-destructive/10 font-medium text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    <CalendarClock className="size-3.5" />
                    {fmtDate(task.dueDate)}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    {editable && (
                      <Link to="/tasks/$id/edit" params={{ id: task.id }}>
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                    )}
                    {editable && onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => onDelete(task.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
