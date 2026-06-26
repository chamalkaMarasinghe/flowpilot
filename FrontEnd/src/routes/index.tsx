import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAppSelector } from "@/app/hooks";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const user = useAppSelector((s) => s.auth.user);
  const hydrated = useAppSelector((s) => s.auth.hydrated);
  if (!hydrated) return null;
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}
