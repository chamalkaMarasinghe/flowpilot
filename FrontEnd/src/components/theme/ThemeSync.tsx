import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { applyThemeToDocument } from "@/utils/preferencesUtils";

/** Applies the active user's theme class to the document root. */
export function ThemeSync() {
  const theme = useAppSelector((s) => s.ui.theme);
  const hydrated = useAppSelector((s) => s.auth.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    applyThemeToDocument(theme);
  }, [theme, hydrated]);

  return null;
}
