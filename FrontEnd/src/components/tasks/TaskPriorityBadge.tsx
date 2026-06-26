import { Badge } from "@/components/ui/badge";
import type { TaskPriority } from "@/types";
import { PRIORITY_LABEL } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";

const STYLE: Record<TaskPriority, string> = {
  LOW: "bg-muted text-muted-foreground hover:bg-muted",
  MEDIUM: "bg-info/15 text-info hover:bg-info/15",
  HIGH: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

export function TaskPriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", STYLE[priority], className)}>
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
}
