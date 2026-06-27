import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";
import { env } from "@/config/env";
import { mockTasks } from "@/mock/tasks.mock";
import { api } from "./apiClient";
import { mockCall } from "./mockApi";

let tasks: Task[] = [...mockTasks];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    if (!env.ENABLE_MOCK_API) return api<Task[]>("/tasks");
    return mockCall(tasks);
  },

  async getTask(id: string): Promise<Task | undefined> {
    if (!env.ENABLE_MOCK_API) return api<Task>(`/tasks/${id}`);
    return mockCall(tasks.find((t) => t.id === id));
  },

  async createTask(req: CreateTaskRequest, createdBy: string): Promise<Task> {
    if (!env.ENABLE_MOCK_API) {
      return api<Task>("/tasks", { method: "POST", body: JSON.stringify(req) });
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      ...req,
      id: `t${Date.now()}`,
      createdBy,
      createdAt: now,
      updatedAt: now,
    };
    tasks = [newTask, ...tasks];
    return mockCall(newTask);
  },

  async updateTask(id: string, req: UpdateTaskRequest): Promise<Task> {
    if (!env.ENABLE_MOCK_API) {
      return api<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(req) });
    }

    const idx = tasks.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error("Task not found");
    const updated: Task = { ...tasks[idx], ...req, updatedAt: new Date().toISOString() };
    tasks[idx] = updated;
    return mockCall(updated);
  },

  async deleteTask(id: string): Promise<string> {
    if (!env.ENABLE_MOCK_API) {
      const result = await api<{ id: string }>(`/tasks/${id}`, { method: "DELETE" });
      return result.id;
    }

    tasks = tasks.filter((t) => t.id !== id);
    return mockCall(id);
  },
};
