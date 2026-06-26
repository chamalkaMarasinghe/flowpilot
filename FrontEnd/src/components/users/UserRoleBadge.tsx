import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 font-medium",
        role === "ADMIN" ? "bg-primary/15 text-primary" : "bg-muted text-foreground",
      )}
    >
      {role === "ADMIN" ? "Admin" : "User"}
    </Badge>
  );
}
