import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createTask } from "@/features/tasks/taskThunks";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks/new")({
  head: () => ({ meta: [{ title: "New task — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <NewTaskPage />
    </ProtectedLayout>
  ),
});

function NewTaskPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user)!;
  const users = useAppSelector((s) => s.users.items);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create new task" description="Add a task to your team's workflow." />
      <Card className="p-6">
        <TaskForm
          users={users}
          submitLabel="Create task"
          onCancel={() => navigate({ to: "/tasks" })}
          onSubmit={async (values) => {
            const res = await dispatch(createTask({ req: values, createdBy: user.id }));
            if (createTask.fulfilled.match(res)) {
              toast.success("Task created");
              navigate({ to: "/tasks/$id", params: { id: res.payload.id } });
            }
          }}
        />
      </Card>
    </div>
  );
}
