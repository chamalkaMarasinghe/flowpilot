import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./userTypes";
import { fetchUsers, setUserRole, setUserStatus } from "./userThunks";

const initialState: UserState = { items: [], loading: false, error: null };

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
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
  },
});

export default userSlice.reducer;
