import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import type { UserRole, UserStatus } from "@/types";

export const fetchUsers = createAsyncThunk("users/fetch", async () => userService.getUsers());

export const setUserStatus = createAsyncThunk(
  "users/setStatus",
  async (p: { id: string; status: UserStatus }) => userService.setStatus(p.id, p.status),
);

export const setUserRole = createAsyncThunk(
  "users/setRole",
  async (p: { id: string; role: UserRole }) => userService.setRole(p.id, p.role),
);
