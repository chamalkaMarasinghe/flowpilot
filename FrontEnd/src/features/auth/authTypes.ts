import type { AuthUser } from "@/types";

export interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
}
