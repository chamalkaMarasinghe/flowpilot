import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIState, UserPreferences } from "@/types";
import { DEFAULT_USER_PREFERENCES } from "@/utils/preferencesUtils";
import {
  hydrateSession,
  loginUser,
  logoutUser,
  registerUser,
  updatePreferences,
} from "@/features/auth/authThunks";
import { logout } from "@/features/auth/authSlice";

const initialState: UIState = { ...DEFAULT_USER_PREFERENCES, sidebarExpanded: true };

function applyPreferences(state: UIState, preferences: UserPreferences) {
  state.sidebarOpen = preferences.sidebarOpen;
  state.tableView = preferences.tableView;
  state.theme = preferences.theme;
  state.sidebarExpanded = preferences.sidebarOpen;
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarExpanded(s) {
      s.sidebarExpanded = !s.sidebarExpanded;
    },
    setSidebarExpanded(s, a: PayloadAction<boolean>) {
      s.sidebarExpanded = a.payload;
    },
    setTableView(s, a: PayloadAction<"table" | "card">) {
      s.tableView = a.payload;
    },
    setTheme(s, a: PayloadAction<"light" | "dark">) {
      s.theme = a.payload;
    },
    hydrateFromPreferences(s, a: PayloadAction<UserPreferences>) {
      applyPreferences(s, a.payload);
    },
    resetUiPreferences(s) {
      applyPreferences(s, DEFAULT_USER_PREFERENCES);
    },
  },
  extraReducers: (b) => {
    const syncFromAuthUser = (s: UIState, user: { preferences: UserPreferences } | null) => {
      if (user?.preferences) applyPreferences(s, user.preferences);
      else applyPreferences(s, DEFAULT_USER_PREFERENCES);
    };

    b.addCase(hydrateSession.fulfilled, (s, a) => {
      syncFromAuthUser(s, a.payload);
    });
    b.addCase(loginUser.fulfilled, (s, a) => {
      syncFromAuthUser(s, a.payload);
    });
    b.addCase(registerUser.fulfilled, (s, a) => {
      syncFromAuthUser(s, a.payload);
    });
    b.addCase(updatePreferences.fulfilled, (s, a) => {
      applyPreferences(s, a.payload);
    });
    b.addCase(logoutUser.fulfilled, (s) => {
      applyPreferences(s, DEFAULT_USER_PREFERENCES);
    });
    b.addCase(logout, (s) => {
      applyPreferences(s, DEFAULT_USER_PREFERENCES);
    });
    b.addCase(hydrateSession.rejected, (s) => {
      applyPreferences(s, DEFAULT_USER_PREFERENCES);
    });
  },
});

export const { toggleSidebarExpanded, setSidebarExpanded, setTableView, setTheme, hydrateFromPreferences, resetUiPreferences } =
  uiSlice.actions;
export default uiSlice.reducer;
