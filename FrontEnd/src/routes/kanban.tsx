import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { fetchTasks } from "@/features/tasks/taskThunks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const Route = createFileRoute("/kanban")({
  head: () => ({ meta: [{ title: "Kanban — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <KanbanPage />
    </ProtectedLayout>
  ),
});

function KanbanPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const loading = useAppSelector((s) => s.tasks.loading);
  const fetched = useAppSelector((s) => s.tasks.fetched);
  const users = useAppSelector((s) => s.users.items);

  useEffect(() => {
    void dispatch(fetchTasks());
  }, [dispatch]);

  if (loading && !fetched) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

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
      <KanbanBoard tasks={tasks} users={users} />
    </>
  );
}
