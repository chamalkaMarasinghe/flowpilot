import { useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import { updatePreferences } from "@/features/auth/authThunks";
import type { UpdatePreferencesRequest } from "@/types";
import { toast } from "sonner";

export function useUpdatePreferences() {
  const dispatch = useAppDispatch();

  return useCallback(
    async (patch: UpdatePreferencesRequest) => {
      try {
        await dispatch(updatePreferences(patch)).unwrap();
      } catch (err) {
        toast.error((err as string) ?? "Failed to save preference");
        throw err;
      }
    },
    [dispatch],
  );
}
