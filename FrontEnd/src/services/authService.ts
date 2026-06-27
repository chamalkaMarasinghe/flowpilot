import type { AuthUser, LoginRequest, RegisterRequest, UpdatePreferencesRequest, UpdateProfileRequest } from "@/types";
import { api, setToken } from "./apiClient";

interface AuthPayload {
  user: AuthUser;
  token: string;
}

export const authService = {
  async login(req: LoginRequest): Promise<AuthUser> {
    const { user, token } = await api<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(req),
    });
    setToken(token);
    return user;
  },

  async register(req: RegisterRequest): Promise<AuthUser> {
    const { user, token } = await api<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify(req),
    });
    setToken(token);
    return user;
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    return api<{ ok: true }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async getMe(): Promise<AuthUser> {
    const { user } = await api<{ user: AuthUser }>("/auth/me");
    return user;
  },

  async updateProfile(req: UpdateProfileRequest): Promise<AuthUser> {
    const { user } = await api<{ user: AuthUser }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(req),
    });
    return user;
  },

  async updatePreferences(req: UpdatePreferencesRequest): Promise<AuthUser> {
    const { user } = await api<{ user: AuthUser }>("/auth/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(req),
    });
    return user;
  },

  async logout(): Promise<void> {
    try {
      await api<{ ok: true }>("/auth/logout", { method: "POST" });
    } catch {
      // Clear local session even if server call fails
    }
    setToken(null);
  },
};
