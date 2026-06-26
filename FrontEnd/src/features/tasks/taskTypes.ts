import type { Task } from "@/types";

export interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}
