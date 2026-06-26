import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppSelector } from "@/app/hooks";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/kanban")({
  head: () => ({ meta: [{ title: "Kanban — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <KanbanPage />
    </ProtectedLayout>
  ),
});

function KanbanPage() {
  const user = useAppSelector((s) => s.auth.user)!;
  const allTasks = useAppSelector((s) => s.tasks.items);
  const users = useAppSelector((s) => s.users.items);
  const scoped = user.role === "ADMIN"
    ? allTasks
    : allTasks.filter((t) => t.createdBy === user.id || t.assignedTo === user.id);

  return (
    <>
      <PageHeader
        title="Kanban board"
        description="Drag cards between columns to update status."
        actions={
          <Link to="/tasks/new">
            <Button className="bg-brand-gradient text-white hover:opacity-95">
              <Plus className="size-4" /> New task
            </Button>
          </Link>
        }
      />
      <KanbanBoard tasks={scoped} users={users} />
    </>
  );
}
