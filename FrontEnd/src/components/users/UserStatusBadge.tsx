import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/types";
import { cn } from "@/lib/utils";

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 font-medium",
        status === "ACTIVE" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {status === "ACTIVE" ? "Active" : "Inactive"}
    </Badge>
  );
}
