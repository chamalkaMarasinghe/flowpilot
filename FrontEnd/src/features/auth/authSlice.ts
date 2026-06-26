import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";
import type { AuthState } from "./authTypes";
import { loginUser, registerUser } from "./authThunks";

const STORAGE_KEY = "flowpilot.auth.user";

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

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
    hydrateFromStorage(state) {
      state.user = loadUser();
      state.hydrated = true;
    },
    logout(state) {
      state.user = null;
      state.hydrated = true;
      persist(null);
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
  },
});

export const { hydrateFromStorage, logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
