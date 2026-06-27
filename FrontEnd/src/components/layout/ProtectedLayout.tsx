import { Navigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks } from "@/features/tasks/taskThunks";
import { fetchUsers } from "@/features/users/userThunks";
import { AppLayout } from "./AppLayout";

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedLayout({ children, requireAdmin }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const hydrated = useAppSelector((s) => s.auth.hydrated);
  const dispatch = useAppDispatch();
  const tasksFetched = useAppSelector((s) => s.tasks.fetched);
  const tasksLoading = useAppSelector((s) => s.tasks.loading);
  const usersLoaded = useAppSelector((s) => s.users.items.length > 0 || s.users.loading);

  useEffect(() => {
    if (user && !tasksFetched && !tasksLoading) void dispatch(fetchTasks());
    if (user && !usersLoaded) void dispatch(fetchUsers());
  }, [user, tasksFetched, tasksLoading, usersLoaded, dispatch]);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return <AppLayout>{children}</AppLayout>;
}
