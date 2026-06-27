import type { AuthUser, LoginRequest, RegisterRequest } from "@/types";
import { env } from "@/config/env";
import { mockUsers, mockCredentials } from "@/mock/users.mock";
import { api, setToken } from "./apiClient";
import { mockCall, mockFail } from "./mockApi";

interface AuthPayload {
  user: AuthUser;
  token: string;
}

const STORAGE_KEY = "flowpilot.auth.user";

function loadMockUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const authService = {
  async login(req: LoginRequest): Promise<AuthUser> {
    if (!env.ENABLE_MOCK_API) {
      const { user, token } = await api<AuthPayload>("/auth/login", {
        method: "POST",
        body: JSON.stringify(req),
      });
      setToken(token);
      return user;
    }

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
    if (!env.ENABLE_MOCK_API) {
      const { user, token } = await api<AuthPayload>("/auth/register", {
        method: "POST",
        body: JSON.stringify(req),
      });
      setToken(token);
      return user;
    }

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
    if (!env.ENABLE_MOCK_API) {
      return api<{ ok: true }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    }

    if (!email) return mockFail("Email is required");
    return mockCall({ ok: true as const });
  },

  async getMe(): Promise<AuthUser> {
    if (!env.ENABLE_MOCK_API) {
      const { user } = await api<{ user: AuthUser }>("/auth/me");
      return user;
    }

    const user = loadMockUser();
    if (!user) throw new Error("Not authenticated");
    return mockCall(user);
  },

  async logout(): Promise<void> {
    if (!env.ENABLE_MOCK_API) {
      try {
        await api<{ ok: true }>("/auth/logout", { method: "POST" });
      } catch {
        // Clear local session even if server call fails
      }
    }
    setToken(null);
  },
};
