import type { User, UserRole, UserStatus } from "@/types";
import { api } from "./apiClient";

export const userService = {
  async getUsers(): Promise<User[]> {
    return api<User[]>("/users");
  },

  async setStatus(id: string, status: UserStatus): Promise<User> {
    return api<User>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async setRole(id: string, role: UserRole): Promise<User> {
    return api<User>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(id: string): Promise<string> {
    const result = await api<{ id: string }>(`/users/${id}`, { method: "DELETE" });
    return result.id;
  },
};
