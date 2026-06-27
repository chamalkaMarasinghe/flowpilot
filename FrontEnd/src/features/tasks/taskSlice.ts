import { createSlice } from "@reduxjs/toolkit";
import type { TaskState } from "./taskTypes";
import { createTask, deleteTask, fetchTaskById, fetchTasks, updateTask } from "./taskThunks";

const initialState: TaskState = { items: [], loading: false, fetched: false, error: null };

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTasks.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchTasks.fulfilled, (s, a) => {
      s.loading = false;
      s.fetched = true;
      s.items = a.payload;
    });
    b.addCase(fetchTasks.rejected, (s, a) => {
      s.loading = false;
      s.fetched = true;
      s.error = a.error.message ?? "Failed to load tasks";
    });

    b.addCase(fetchTaskById.fulfilled, (s, a) => {
      const i = s.items.findIndex((t) => t.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
      else s.items.unshift(a.payload);
    });

    b.addCase(createTask.fulfilled, (s, a) => {
      s.items.unshift(a.payload);
    });
    b.addCase(updateTask.fulfilled, (s, a) => {
      const i = s.items.findIndex((t) => t.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteTask.fulfilled, (s, a) => {
      s.items = s.items.filter((t) => t.id !== a.payload);
    });
  },
});

export default taskSlice.reducer;
