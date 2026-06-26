import { DashboardPanel } from "./DashboardPanel";
import type { PipelineRow } from "@/utils/dashboardUtils";

interface Props {
  rows: PipelineRow[];
}

export function StatusPipelinePanel({ rows }: Props) {
  return (
    <DashboardPanel title="Status pipeline">
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.status}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{row.label}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium tabular-nums text-primary">
                  {row.count}
                </span>
                <span className="tabular-nums">{row.percent}%</span>
              </div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${row.percent}%`, backgroundColor: row.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}
