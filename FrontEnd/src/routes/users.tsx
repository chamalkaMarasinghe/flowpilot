import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRoleBadge } from "@/components/users/UserRoleBadge";
import { UserStatusBadge } from "@/components/users/UserStatusBadge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { deleteUser, setUserRole, setUserStatus } from "@/features/users/userThunks";
import { fetchTasks } from "@/features/tasks/taskThunks";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";
import type { UserRole } from "@/types";
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

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout requireAdmin>
      <UsersPage />
    </ProtectedLayout>
  ),
});

function UsersPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user)!;
  const users = useAppSelector((s) => s.users.items);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"ALL" | UserRole>("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (role !== "ALL" && u.role !== role) return false;
      if (status !== "ALL" && u.status !== status) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        return u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      }
      return true;
    });
  }, [users, q, role, status]);

  const onDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await dispatch(deleteUser(confirmDeleteId)).unwrap();
      void dispatch(fetchTasks());
      toast.success("User deleted");
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error((err as string) ?? "Failed to delete user");
    }
  };

  return (
    <>
      <PageHeader title="User management" description="Manage roles and access for your team." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="pl-9" />
        </div>
        <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => {
              const initials = u.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");
              const isSelf = u.id === currentUser.id;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-brand-gradient text-white">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.fullName}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      disabled={isSelf}
                      onValueChange={async (v) => {
                        try {
                          await dispatch(setUserRole({ id: u.id, role: v as UserRole })).unwrap();
                          toast.success("Role updated");
                        } catch (err) {
                          toast.error((err as string) ?? "Failed to update role");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><UserStatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.department ?? "—"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={u.status === "ACTIVE"}
                      disabled={isSelf}
                      onCheckedChange={async (checked) => {
                        try {
                          await dispatch(
                            setUserStatus({ id: u.id, status: checked ? "ACTIVE" : "INACTIVE" }),
                          ).unwrap();
                          toast.success(checked ? "User activated" : "User deactivated");
                        } catch (err) {
                          toast.error((err as string) ?? "Failed to update status");
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isSelf}
                      aria-label={`Delete ${u.fullName}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setConfirmDeleteId(u.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 hidden">
        <UserRoleBadge role="ADMIN" />
      </div>

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the user and all tasks they created or were assigned to. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
