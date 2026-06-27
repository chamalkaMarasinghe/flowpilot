import type { User, UserRole, UserStatus } from "@/types";
import { env } from "@/config/env";
import { mockUsers } from "@/mock/users.mock";
import { api } from "./apiClient";
import { mockCall } from "./mockApi";

let users: User[] = [...mockUsers];

export const userService = {
  async getUsers(): Promise<User[]> {
    if (!env.ENABLE_MOCK_API) return api<User[]>("/users");
    return mockCall(users);
  },

  async setStatus(id: string, status: UserStatus): Promise<User> {
    if (!env.ENABLE_MOCK_API) {
      return api<User>(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }

    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("User not found");
    users[idx] = { ...users[idx], status, updatedAt: new Date().toISOString() };
    return mockCall(users[idx]);
  },

  async setRole(id: string, role: UserRole): Promise<User> {
    if (!env.ENABLE_MOCK_API) {
      return api<User>(`/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
    }

    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("User not found");
    users[idx] = { ...users[idx], role, updatedAt: new Date().toISOString() };
    return mockCall(users[idx]);
  },
};
