import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "@/types";

const initialState: UIState = {
  sidebarOpen: true,
  theme: "light",
  tableView: "table",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(s) {
      s.sidebarOpen = !s.sidebarOpen;
    },
    setSidebar(s, a: PayloadAction<boolean>) {
      s.sidebarOpen = a.payload;
    },
    setTableView(s, a: PayloadAction<"table" | "card">) {
      s.tableView = a.payload;
    },
  },
});

export const { toggleSidebar, setSidebar, setTableView } = uiSlice.actions;
export default uiSlice.reducer;
