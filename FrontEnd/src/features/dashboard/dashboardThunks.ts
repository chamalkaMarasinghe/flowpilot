import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardPeriod, TaskFocus } from "@/types";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async (params: { period: DashboardPeriod; taskFocus: TaskFocus }, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboard(params.period, params.taskFocus);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);
