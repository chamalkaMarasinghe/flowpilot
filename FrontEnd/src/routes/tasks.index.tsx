import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Rows3 } from "lucide-react";
import { setTableView } from "@/features/ui/uiSlice";
import { useUpdatePreferences } from "@/hooks/useUpdatePreferences";
import { deleteTask } from "@/features/tasks/taskThunks";
import { toast } from "sonner";
import type { TaskFilters as Filters, TaskSortKey } from "@/types";
import { filterAndSortTasks } from "@/utils/taskUtils";
import { EmptyState } from "@/components/common/EmptyState";
import { ListChecks } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks/")({
  head: () => ({ meta: [{ title: "Tasks — FlowPilot" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <ProtectedLayout>
      <TasksPage />
    </ProtectedLayout>
  ),
});

function TasksPage() {
  const { q } = Route.useSearch();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;
  const allTasks = useAppSelector((s) => s.tasks.items);
  const loading = useAppSelector((s) => s.tasks.loading);
  const fetched = useAppSelector((s) => s.tasks.fetched);
  const users = useAppSelector((s) => s.users.items);
  const view = useAppSelector((s) => s.ui.tableView);
  const savePreferences = useUpdatePreferences();

  const [filters, setFilters] = useState<Filters>({
    search: q ?? "",
    status: "ALL",
    priority: "ALL",
    assignedTo: "ALL",
  });
  const [sort, setSort] = useState<TaskSortKey>("dueDate");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: q ?? "" }));
  }, [q]);

  const visible = useMemo(
    () => filterAndSortTasks(allTasks, filters, sort),
    [allTasks, filters, sort],
  );

  const onDelete = async () => {
    if (!confirmId) return;
    const res = await dispatch(deleteTask(confirmId));
    if (deleteTask.fulfilled.match(res)) {
      toast.success("Task deleted");
      setConfirmId(null);
    } else {
      toast.error((res.payload as string) ?? "Failed to delete task");
    }
  };

  const canEdit = (taskCreatorId: string, assignee: string) =>
    user.role === "ADMIN" || taskCreatorId === user.id || assignee === user.id;

  return (
    <>
      <PageHeader
        title="Tasks"
        description={user.role === "ADMIN" ? "All tasks across the workspace" : "Tasks you created or that are assigned to you"}
        actions={
          <>
            <Select value={sort} onValueChange={(v) => setSort(v as TaskSortKey)}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Sort: Due date</SelectItem>
                <SelectItem value="priority">Sort: Priority</SelectItem>
                <SelectItem value="status">Sort: Status</SelectItem>
                <SelectItem value="createdAt">Sort: Newest</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex overflow-hidden rounded-md border">
              <button
                onClick={() => {
                  dispatch(setTableView("table"));
                  void savePreferences({ tableView: "table" });
                }}
                className={`px-3 py-2 text-sm ${view === "table" ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                aria-label="Table view"
              >
                <Rows3 className="size-4" />
              </button>
              <button
                onClick={() => {
                  dispatch(setTableView("card"));
                  void savePreferences({ tableView: "card" });
                }}
                className={`px-3 py-2 text-sm ${view === "card" ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                aria-label="Card view"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
            <Link to="/tasks/new">
              <Button className="bg-brand-gradient text-white hover:opacity-95">
                <Plus className="size-4" /> New task
              </Button>
            </Link>
          </>
        }
      />

      <TaskFilters filters={filters} onChange={setFilters} users={users} />

      {loading && !fetched ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="size-10" />}
          title="No tasks found"
          description="Try adjusting filters or create a new task."
          action={
            <Link to="/tasks/new">
              <Button><Plus className="size-4" /> New task</Button>
            </Link>
          }
        />
      ) : view === "table" ? (
        <TaskTable
          tasks={visible}
          users={users}
          onDelete={setConfirmId}
          canEdit={(t) => canEdit(t.createdBy, t.assignedTo)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => <TaskCard key={t.id} task={t} users={users} />)}
        </div>
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
