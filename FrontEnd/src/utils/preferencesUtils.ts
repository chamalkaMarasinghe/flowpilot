import type { UserPreferences } from "@/types";

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  sidebarOpen: true,
  tableView: "table",
  theme: "light",
};

export function applyThemeToDocument(theme: UserPreferences["theme"]) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function normalizeUserPreferences(input?: Partial<UserPreferences> | null): UserPreferences {
  return {
    sidebarOpen: input?.sidebarOpen ?? DEFAULT_USER_PREFERENCES.sidebarOpen,
    tableView: input?.tableView ?? DEFAULT_USER_PREFERENCES.tableView,
    theme: input?.theme ?? DEFAULT_USER_PREFERENCES.theme,
  };
}
