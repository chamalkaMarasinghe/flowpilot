import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import type { UserState } from "./userTypes";
import { deleteUser, fetchUsers, setUserRole, setUserStatus } from "./userThunks";

const initialState: UserState = { items: [], loading: false, error: null };

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    patchUserInList(state, action: PayloadAction<{ id: string; patch: Partial<User> }>) {
      const i = state.items.findIndex((u) => u.id === action.payload.id);
      if (i >= 0) Object.assign(state.items[i], action.payload.patch);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchUsers.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchUsers.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? "Failed to load users";
    });
    b.addCase(setUserStatus.fulfilled, (s, a) => {
      const i = s.items.findIndex((u) => u.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(setUserRole.fulfilled, (s, a) => {
      const i = s.items.findIndex((u) => u.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteUser.fulfilled, (s, a) => {
      s.items = s.items.filter((u) => u.id !== a.payload);
    });
  },
});

export const { patchUserInList } = userSlice.actions;
export default userSlice.reducer;
