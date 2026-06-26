import { PieChart, Pie, Cell, Label } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardPanel } from "./DashboardPanel";
import type { TaskStatus } from "@/types";
import { STATUS_LABEL } from "@/utils/taskUtils";

interface StatusDatum {
  status: TaskStatus;
  label: string;
  value: number;
  fill: string;
}

interface Props {
  data: StatusDatum[];
  total: number;
}

const chartConfig = {
  open: { label: STATUS_LABEL.OPEN, color: "oklch(0.72 0.02 270)" },
  inProgress: { label: STATUS_LABEL.IN_PROGRESS, color: "oklch(0.52 0.22 280)" },
  testing: { label: STATUS_LABEL.TESTING, color: "oklch(0.78 0.16 75)" },
  done: { label: STATUS_LABEL.DONE, color: "oklch(0.66 0.16 155)" },
};

export function TaskStatusDonut({ data, total }: Props) {
  const active = data.filter((d) => d.value > 0);

  return (
    <DashboardPanel title="Tasks overview">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] w-full max-w-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={active.length ? active : [{ label: "Empty", value: 1, fill: "oklch(0.92 0.01 270)" }]}
              dataKey="value"
              nameKey="label"
              innerRadius={58}
              outerRadius={82}
              strokeWidth={4}
              stroke="var(--card)"
            >
              {active.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 4}
                          className="fill-primary text-2xl font-semibold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 16}
                          className="fill-muted-foreground text-[11px]"
                        >
                          tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="space-y-3 text-sm">
          {data.map((row) => (
            <li key={row.status} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: row.fill }} />
                <span className="text-muted-foreground">{row.label}</span>
              </div>
              <span className="font-semibold tabular-nums text-primary">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardPanel>
  );
}
