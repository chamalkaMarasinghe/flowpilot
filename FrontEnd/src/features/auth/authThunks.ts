import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { getToken } from "@/services/apiClient";
import { env } from "@/config/env";
import type { LoginRequest, RegisterRequest } from "@/types";

export const loginUser = createAsyncThunk("auth/login", async (req: LoginRequest, { rejectWithValue }) => {
  try {
    return await authService.login(req);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const registerUser = createAsyncThunk("auth/register", async (req: RegisterRequest, { rejectWithValue }) => {
  try {
    return await authService.register(req);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgot", async (email: string, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const hydrateSession = createAsyncThunk("auth/hydrate", async (_, { rejectWithValue }) => {
  try {
    if (env.ENABLE_MOCK_API) {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("flowpilot.auth.user") : null;
      return raw ? (JSON.parse(raw) as import("@/types").AuthUser) : null;
    }

    const token = getToken();
    if (!token) return null;

    return await authService.getMe();
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});
