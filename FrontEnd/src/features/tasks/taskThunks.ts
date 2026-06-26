import { createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "@/services/taskService";
import type { CreateTaskRequest, UpdateTaskRequest } from "@/types";

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => taskService.getTasks());

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: { req: CreateTaskRequest; createdBy: string }) =>
    taskService.createTask(payload.req, payload.createdBy),
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: { id: string; req: UpdateTaskRequest }) =>
    taskService.updateTask(payload.id, payload.req),
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string) =>
  taskService.deleteTask(id),
);
