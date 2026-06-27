import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { getToken } from "@/services/apiClient";
import type { LoginRequest, RegisterRequest, UpdatePreferencesRequest, UpdateProfileRequest } from "@/types";

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (req: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(req);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const updatePreferences = createAsyncThunk(
  "auth/updatePreferences",
  async (req: UpdatePreferencesRequest, { rejectWithValue }) => {
    try {
      const user = await authService.updatePreferences(req);
      return user.preferences;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);
