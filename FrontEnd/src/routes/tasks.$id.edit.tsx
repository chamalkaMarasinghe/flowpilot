import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateTask } from "@/features/tasks/taskThunks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/tasks/$id/edit")({
  head: () => ({ meta: [{ title: "Edit task — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <EditTaskPage />
    </ProtectedLayout>
  ),
});

function EditTaskPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const task = useAppSelector((s) => s.tasks.items.find((t) => t.id === id));
  const user = useAppSelector((s) => s.auth.user)!;
  const users = useAppSelector((s) => s.users.items);

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        action={<Link to="/tasks"><Button>Back to tasks</Button></Link>}
      />
    );
  }

  const canEdit = user.role === "ADMIN" || task.createdBy === user.id || task.assignedTo === user.id;
  if (!canEdit) {
    return <EmptyState title="Not allowed" description="You don't have permission to edit this task." />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit task" />
      <Card className="p-6">
        <TaskForm
          initial={task}
          users={users}
          submitLabel="Save changes"
          onCancel={() => navigate({ to: "/tasks/$id", params: { id } })}
          onSubmit={async (values) => {
            await dispatch(updateTask({ id, req: values }));
            toast.success("Task updated");
            navigate({ to: "/tasks/$id", params: { id } });
          }}
        />
      </Card>
    </div>
  );
}
