import type { User, UserRole, UserStatus } from "@/types";
import { mockUsers } from "@/mock/users.mock";
import { mockCall } from "./mockApi";

let users: User[] = [...mockUsers];

export const userService = {
  async getUsers(): Promise<User[]> {
    return mockCall(users);
  },
  async setStatus(id: string, status: UserStatus): Promise<User> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("User not found");
    users[idx] = { ...users[idx], status, updatedAt: new Date().toISOString() };
    return mockCall(users[idx]);
  },
  async setRole(id: string, role: UserRole): Promise<User> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("User not found");
    users[idx] = { ...users[idx], role, updatedAt: new Date().toISOString() };
    return mockCall(users[idx]);
  },
};
