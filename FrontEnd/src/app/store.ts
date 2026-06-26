import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import taskReducer from "@/features/tasks/taskSlice";
import userReducer from "@/features/users/userSlice";
import uiReducer from "@/features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    users: userReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
