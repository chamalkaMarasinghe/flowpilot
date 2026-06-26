import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
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
