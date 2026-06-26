import type { User } from "@/types";

export interface UserState {
  items: User[];
  loading: boolean;
  error: string | null;
}
