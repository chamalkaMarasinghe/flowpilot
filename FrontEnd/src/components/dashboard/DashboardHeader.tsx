import { Link } from "@tanstack/react-router";
import { KanbanSquare, ListChecks, Plus } from "lucide-react";
import type { DashboardPeriod } from "@/utils/dashboardUtils";
import { PERIOD_LABEL } from "@/utils/dashboardUtils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  firstName: string;
  roleLabel: string;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  completionRate: number;
  totalTasks: number;
  overdueCount: number;
}

const PERIODS: DashboardPeriod[] = ["today", "week", "month", "all"];

export function DashboardHeader({
  firstName,
  roleLabel,
  period,
  onPeriodChange,
  completionRate,
  totalTasks,
  overdueCount,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{roleLabel}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl">
            Project dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Good to see you, {firstName}. Here&apos;s how your work is tracking across tasks and deadlines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/tasks/new">
            <Button className="bg-brand-gradient text-white hover:opacity-95">
              <Plus className="size-4" /> New task
            </Button>
          </Link>
          <Link to="/kanban">
            <Button variant="outline">
              <KanbanSquare className="size-4" /> Kanban
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline">
              <ListChecks className="size-4" /> All tasks
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-card/80 p-4 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onPeriodChange(key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                period === key
                  ? "bg-brand-gradient text-white shadow-elegant"
                  : "bg-primary/8 text-primary hover:bg-primary/12",
              )}
            >
              {PERIOD_LABEL[key]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Total tasks</p>
            <p className="text-lg font-semibold tabular-nums text-primary">{totalTasks}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completion</p>
            <p className="text-lg font-semibold tabular-nums text-primary">{completionRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className={cn("text-lg font-semibold tabular-nums", overdueCount > 0 && "text-destructive")}>
              {overdueCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
