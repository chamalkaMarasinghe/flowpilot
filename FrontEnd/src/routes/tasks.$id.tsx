import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { TaskPriorityBadge } from "@/components/tasks/TaskPriorityBadge";
import { fmtDateTime, isOverdue, fmtDate } from "@/utils/dateUtils";
import { ALL_STATUSES, STATUS_LABEL } from "@/utils/taskUtils";
import { deleteTask, updateTask } from "@/features/tasks/taskThunks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, Calendar, User as UserIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TaskStatus } from "@/types";

export const Route = createFileRoute("/tasks/$id")({
  head: () => ({ meta: [{ title: "Task details — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <TaskDetailsPage />
    </ProtectedLayout>
  ),
});

function TaskDetailsPage() {
  const { id } = Route.useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user)!;
  const task = useAppSelector((s) => s.tasks.items.find((t) => t.id === id));
  const users = useAppSelector((s) => s.users.items);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="It may have been deleted."
        action={<Link to="/tasks"><Button>Back to tasks</Button></Link>}
      />
    );
  }

  const canEdit = user.role === "ADMIN" || task.createdBy === user.id || task.assignedTo === user.id;
  const creator = users.find((u) => u.id === task.createdBy);
  const assignee = users.find((u) => u.id === task.assignedTo);
  const overdue = task.status !== "DONE" && isOverdue(task.dueDate);

  return (
    <>
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to tasks
      </Link>

      <PageHeader
        title={task.title}
        actions={
          canEdit && (
            <>
              <Link to="/tasks/$id/edit" params={{ id: task.id }}>
                <Button variant="outline"><Pencil className="size-4" /> Edit</Button>
              </Link>
              <Button variant="outline" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4 text-destructive" /> Delete
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
            {overdue && (
              <span className="rounded-md bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                Overdue
              </span>
            )}
          </div>
          <h2 className="mb-2 text-sm font-semibold">Description</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{task.description}</p>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
            {canEdit ? (
              <Select
                value={task.status}
                onValueChange={async (v) => {
                  await dispatch(updateTask({ id: task.id, req: { status: v as TaskStatus } }));
                  toast.success(`Moved to ${STATUS_LABEL[v as TaskStatus]}`);
                }}
              >
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : <p className="mt-1 text-sm">{STATUS_LABEL[task.status]}</p>}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due date</p>
            <p className={`mt-1 flex items-center gap-2 text-sm ${overdue ? "text-destructive font-medium" : ""}`}>
              <Calendar className="size-4" /> {fmtDate(task.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assigned to</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <UserIcon className="size-4" /> {assignee?.fullName ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Created by</p>
            <p className="mt-1 text-sm">{creator?.fullName ?? "—"}</p>
          </div>

          <div className="border-t pt-4 text-xs text-muted-foreground">
            <p>Created: {fmtDateTime(task.createdAt)}</p>
            <p>Updated: {fmtDateTime(task.updatedAt)}</p>
          </div>
        </Card>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await dispatch(deleteTask(task.id));
                toast.success("Task deleted");
                navigate({ to: "/tasks" });
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
