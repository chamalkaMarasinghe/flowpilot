import type { AuthUser, LoginRequest, RegisterRequest } from "@/types";
import { mockUsers, mockCredentials } from "@/mock/users.mock";
import { mockCall, mockFail } from "./mockApi";

export const authService = {
  async login(req: LoginRequest): Promise<AuthUser> {
    const user = mockUsers.find((u) => u.email.toLowerCase() === req.email.toLowerCase());
    if (!user) return mockFail("No account found for that email");
    if (user.status === "INACTIVE") return mockFail("Account is deactivated");
    if (mockCredentials[user.email] !== req.password) return mockFail("Incorrect password");
    const auth: AuthUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
    return mockCall(auth);
  },

  async register(req: RegisterRequest): Promise<AuthUser> {
    if (req.password !== req.confirmPassword) return mockFail("Passwords do not match");
    if (mockUsers.some((u) => u.email.toLowerCase() === req.email.toLowerCase()))
      return mockFail("Email already registered");
    const auth: AuthUser = {
      id: `u${Date.now()}`,
      fullName: req.fullName,
      email: req.email,
      role: "USER",
    };
    return mockCall(auth);
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    if (!email) return mockFail("Email is required");
    return mockCall({ ok: true as const });
  },
};
