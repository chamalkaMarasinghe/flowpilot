import type { DashboardData, DashboardPeriod, TaskFocus } from "@/types";

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  period: DashboardPeriod;
  taskFocus: TaskFocus;
}
