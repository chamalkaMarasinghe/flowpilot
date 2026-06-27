import { createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "@/services/taskService";
import type { CreateTaskRequest, TaskListQuery, UpdateTaskRequest } from "@/types";

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (params?: TaskListQuery, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(params);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const fetchTaskById = createAsyncThunk("tasks/fetchOne", async (id: string, { rejectWithValue }) => {
  try {
    return await taskService.getTask(id);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const createTask = createAsyncThunk(
  "tasks/create",
  async (req: CreateTaskRequest, { rejectWithValue }) => {
    try {
      return await taskService.createTask(req);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: { id: string; req: UpdateTaskRequest }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(payload.id, payload.req);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string, { rejectWithValue }) => {
  try {
    return await taskService.deleteTask(id);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
