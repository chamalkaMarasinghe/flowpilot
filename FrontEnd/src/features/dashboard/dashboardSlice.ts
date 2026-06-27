import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardPeriod, TaskFocus } from "@/types";
import type { DashboardState } from "./dashboardTypes";
import { fetchDashboard } from "./dashboardThunks";

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  period: "month",
  taskFocus: "today",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPeriod(state, action: PayloadAction<DashboardPeriod>) {
      state.period = action.payload;
    },
    setTaskFocus(state, action: PayloadAction<TaskFocus>) {
      state.taskFocus = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchDashboard.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchDashboard.fulfilled, (s, a) => {
      s.loading = false;
      s.data = a.payload;
      s.period = a.payload.period;
      s.taskFocus = a.payload.taskFocus;
    });
    b.addCase(fetchDashboard.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? "Failed to load dashboard";
    });
  },
});

export const { setPeriod, setTaskFocus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
