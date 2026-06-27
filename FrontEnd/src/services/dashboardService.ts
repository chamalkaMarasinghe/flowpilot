import type { DashboardData, DashboardPeriod, TaskFocus } from "@/types";
import { api } from "./apiClient";

export const dashboardService = {
  async getDashboard(period: DashboardPeriod, taskFocus: TaskFocus): Promise<DashboardData> {
    const q = new URLSearchParams({ period, taskFocus });
    return api<DashboardData>(`/dashboard?${q.toString()}`);
  },
};
