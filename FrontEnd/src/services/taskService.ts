import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";
import { mockTasks } from "@/mock/tasks.mock";
import { mockCall } from "./mockApi";

// in-memory store (frontend-only mock)
let tasks: Task[] = [...mockTasks];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return mockCall(tasks);
  },
  async getTask(id: string): Promise<Task | undefined> {
    return mockCall(tasks.find((t) => t.id === id));
  },
  async createTask(req: CreateTaskRequest, createdBy: string): Promise<Task> {
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
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error("Task not found");
    const updated: Task = { ...tasks[idx], ...req, updatedAt: new Date().toISOString() };
    tasks[idx] = updated;
    return mockCall(updated);
  },
  async deleteTask(id: string): Promise<string> {
    tasks = tasks.filter((t) => t.id !== id);
    return mockCall(id);
  },
};
