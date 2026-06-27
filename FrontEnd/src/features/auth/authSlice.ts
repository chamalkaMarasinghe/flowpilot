import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";
import { setToken } from "@/services/apiClient";
import type { AuthState } from "./authTypes";
import { hydrateSession, loginUser, logoutUser, registerUser, updatePreferences, updateProfile } from "./authThunks";

const STORAGE_KEY = "flowpilot.auth.user";

function persist(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
}

const initialState: AuthState = {
  user: null,
  hydrated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.hydrated = true;
      state.error = null;
      persist(null);
      setToken(null);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.hydrated = true;
      persist(action.payload);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(hydrateSession.pending, (s) => {
      s.loading = true;
    });
    b.addCase(hydrateSession.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload;
      s.hydrated = true;
      persist(a.payload);
    });
    b.addCase(hydrateSession.rejected, (s) => {
      s.loading = false;
      s.user = null;
      s.hydrated = true;
      persist(null);
      setToken(null);
    });

    b.addCase(loginUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loginUser.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload;
      s.hydrated = true;
      persist(a.payload);
    });
    b.addCase(loginUser.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? a.error.message ?? "Login failed";
    });

    b.addCase(registerUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(registerUser.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload;
      s.hydrated = true;
      persist(a.payload);
    });
    b.addCase(registerUser.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? a.error.message ?? "Register failed";
    });

    b.addCase(logoutUser.fulfilled, (s) => {
      s.user = null;
      s.hydrated = true;
      s.error = null;
      persist(null);
      setToken(null);
    });

    b.addCase(updateProfile.fulfilled, (s, a) => {
      s.user = a.payload;
      s.hydrated = true;
      persist(a.payload);
    });

    b.addCase(updatePreferences.fulfilled, (s, a) => {
      if (s.user) {
        s.user.preferences = a.payload;
        persist(s.user);
      }
    });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
