import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types";
import { STATUS_LABEL } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<TaskStatus, string> = {
  OPEN: "bg-muted text-foreground hover:bg-muted",
  IN_PROGRESS: "bg-info/15 text-info hover:bg-info/15",
  TESTING: "bg-warning/20 text-warning-foreground hover:bg-warning/20",
  DONE: "bg-success/15 text-success hover:bg-success/15",
};

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", STATUS_STYLE[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
