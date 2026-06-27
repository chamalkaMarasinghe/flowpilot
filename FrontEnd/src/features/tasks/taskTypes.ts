import type { Task } from "@/types";

export interface TaskState {
  items: Task[];
  loading: boolean;
  fetched: boolean;
  error: string | null;
}
