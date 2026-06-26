import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { DashboardPanel } from "./DashboardPanel";

interface TrendDatum {
  label: string;
  created: number;
  completed: number;
}

interface Props {
  data: TrendDatum[];
}

const chartConfig = {
  created: { label: "Created", color: "oklch(0.52 0.22 280)" },
  completed: { label: "Completed", color: "oklch(0.66 0.16 155)" },
};

export function TasksTrendChart({ data }: Props) {
  return (
    <DashboardPanel title="Created vs completed">
      <ChartContainer config={chartConfig} className="aspect-[16/9] h-[220px] w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-created)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-created)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-completed)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-completed)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/50" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} width={28} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="created"
            stroke="var(--color-created)"
            fill="url(#fillCreated)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="var(--color-completed)"
            fill="url(#fillCompleted)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </DashboardPanel>
  );
}
