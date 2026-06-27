import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import type { UserRole, UserStatus } from "@/types";

export const fetchUsers = createAsyncThunk("users/fetch", async (_, { rejectWithValue }) => {
  try {
    return await userService.getUsers();
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const setUserStatus = createAsyncThunk(
  "users/setStatus",
  async (p: { id: string; status: UserStatus }, { rejectWithValue }) => {
    try {
      return await userService.setStatus(p.id, p.status);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const setUserRole = createAsyncThunk(
  "users/setRole",
  async (p: { id: string; role: UserRole }, { rejectWithValue }) => {
    try {
      return await userService.setRole(p.id, p.role);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const deleteUser = createAsyncThunk("users/delete", async (id: string, { rejectWithValue }) => {
  try {
    return await userService.deleteUser(id);
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});
