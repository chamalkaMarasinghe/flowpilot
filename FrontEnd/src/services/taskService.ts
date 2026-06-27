import type { CreateTaskRequest, Task, TaskListQuery, UpdateTaskRequest } from "@/types";
import { api } from "./apiClient";

function toQueryString(params?: TaskListQuery): string {
  if (!params) return "";
  const q = new URLSearchParams();
  if (params.search?.trim()) q.set("search", params.search.trim());
  if (params.status && params.status !== "ALL") q.set("status", params.status);
  if (params.priority && params.priority !== "ALL") q.set("priority", params.priority);
  if (params.assignedTo && params.assignedTo !== "ALL") q.set("assignedTo", params.assignedTo);
  if (params.sort) q.set("sort", params.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const taskService = {
  async getTasks(params?: TaskListQuery): Promise<Task[]> {
    return api<Task[]>(`/tasks${toQueryString(params)}`);
  },

  async getTask(id: string): Promise<Task> {
    return api<Task>(`/tasks/${id}`);
  },

  async createTask(req: CreateTaskRequest): Promise<Task> {
    return api<Task>("/tasks", { method: "POST", body: JSON.stringify(req) });
  },

  async updateTask(id: string, req: UpdateTaskRequest): Promise<Task> {
    return api<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(req) });
  },

  async deleteTask(id: string): Promise<string> {
    const result = await api<{ id: string }>(`/tasks/${id}`, { method: "DELETE" });
    return result.id;
  },
};
